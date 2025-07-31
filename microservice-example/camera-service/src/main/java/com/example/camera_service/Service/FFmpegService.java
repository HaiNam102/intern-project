package com.example.camera_service.Service;

import com.example.camera_service.Exception.ApiException;
import com.example.camera_service.Exception.ErrorCode;
import com.example.camera_service.Model.Camera;
import com.example.camera_service.Repository.CameraRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class FFmpegService {
    private Process ffmpegProcess;
    CameraRepository cameraRepository;
    ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Autowired
    public FFmpegService(CameraRepository cameraRepository) {
        this.cameraRepository = cameraRepository;
    }

    public void startStream(Long id) {
        try {
            Camera camera = cameraRepository.findById(id)
                    .orElseThrow(() -> new ApiException(ErrorCode.CAMERA_NOT_FOUND));

            String cameraUrl = camera.getStreamUrl();
            if (cameraUrl == null || cameraUrl.trim().isEmpty()) {
                log.error("Camera {} has no stream URL", id);
                throw new ApiException(ErrorCode.CAMERA_NOT_FOUND);
            }

            // Use relative path for output directory
            String outputDir = "src/main/resources/static/videos/camera_" + id;
            Path outputPath = Paths.get(outputDir);

            // Create directory if it doesn't exist
            if (!Files.exists(outputPath)) {
                Files.createDirectories(outputPath);
                log.info("Created directory: {}", outputPath);
            }

            // Clean up old files before starting new stream
            cleanupOldFiles(outputPath.toFile());

            // Build FFmpeg command with better parameters for HLS
            ProcessBuilder pb = new ProcessBuilder(
                    "ffmpeg",
                    "-rtsp_transport", "tcp",
                    "-i", cameraUrl,
                    "-c:v", "libx264",           // Use H.264 codec
                    "-c:a", "aac",               // Use AAC audio codec
                    "-preset", "ultrafast",       // Fast encoding
                    "-tune", "zerolatency",       // Low latency
                    "-f", "hls",                 // HLS format
                    "-hls_time", "2",            // Segment duration
                    "-hls_list_size", "5",       // Number of segments in playlist
                    "-hls_flags", "delete_segments", // Delete old segments
                    "-hls_segment_filename", outputDir + "/segment_%03d.ts",
                    "-y",                        // Overwrite output files
                    outputDir + "/index.m3u8"
            );

            // Redirect error stream to log
            pb.redirectErrorStream(true);

            log.info("Starting FFmpeg for camera {} with URL: {}", id, cameraUrl);
            ffmpegProcess = pb.start();

            // Monitor FFmpeg process
            new Thread(() -> {
                try {
                    int exitCode = ffmpegProcess.waitFor();
                    if (exitCode != 0) {
                        log.error("FFmpeg process exited with code {} for camera {}", exitCode, id);
                    } else {
                        log.info("FFmpeg process completed successfully for camera {}", id);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.error("FFmpeg process interrupted for camera {}", id);
                }
            }).start();

            log.info("FFmpeg stream started for camera {}", id);

        } catch (IOException e) {
            log.error("Failed to start FFmpeg for camera {}: {}", id, e.getMessage());
            throw new ApiException(ErrorCode.CAMERA_NOT_FOUND);
        } catch (Exception e) {
            log.error("Unexpected error starting stream for camera {}: {}", id, e.getMessage());
            throw new ApiException(ErrorCode.CAMERA_NOT_FOUND);
        }
    }

    public void stopStream(Long id) {
        try {
            if (ffmpegProcess != null && ffmpegProcess.isAlive()) {
                log.info("Stopping FFmpeg process for camera {}", id);
                ffmpegProcess.destroy();

                // Wait for process to terminate gracefully
                if (!ffmpegProcess.waitFor(5, TimeUnit.SECONDS)) {
                    log.warn("FFmpeg process didn't terminate gracefully, forcing shutdown");
                    ffmpegProcess.destroyForcibly();
                }

                log.info("FFmpeg stream stopped for camera {}", id);
            }
        } catch (Exception e) {
            log.error("Error stopping FFmpeg for camera {}: {}", id, e.getMessage());
        }
    }

    private void cleanupOldFiles(File directory) {
        try {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile() && isHLSFile(file)) {
                        boolean deleted = file.delete();
                        if (deleted) {
                            log.debug("Deleted old HLS file: {}", file.getName());
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error cleaning up old files: {}", e.getMessage());
        }
    }

    private boolean isHLSFile(File file) {
        String name = file.getName();
        return name.endsWith(".ts") || name.endsWith(".m3u8");
    }
}
