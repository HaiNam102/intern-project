package com.example.chat_message.Service;

import com.example.chat_message.Dto.ApiResponse;
import com.example.chat_message.Dto.Request.ConversationRequest;
import com.example.chat_message.Dto.Response.ConversationResponse;
import com.example.chat_message.Dto.Response.UserResponse;
import com.example.chat_message.Mapper.ConversationMapper;
import com.example.chat_message.Model.Conversation;
import com.example.chat_message.Repository.ConversationRepository;
import com.example.chat_message.Repository.httpClient.UserClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.StringJoiner;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationService {
    ConversationRepository conversationRepository;
    ConversationMapper conversationMapper;
    UserClient userClient;

    public List<ConversationResponse> myConversations(Long userId) {
        List<Conversation> conversations = conversationRepository.findAllByUsersContaining(userId);
        List<ConversationResponse> conversationResponses = new ArrayList<>();
        for (Conversation conversation : conversations) {
            ConversationResponse conversationResponse = conversationMapper.toConversationResponse(conversation);
            if (conversation.getUsers() != null) {
                for (Long participantId : conversation.getUsers()) {
                    UserResponse participant = userClient.getUserByToken1(participantId).getData();
                    if (participant != null && !participant.getUserId().equals(userId)) {
                        conversationResponse.setConversationName(participant.getNameOfUser());
//                        conversationResponse.set(participant.getAvatar());
                        break;
                    }
                }
            }
            conversationResponses.add(conversationResponse);
        }
        return conversationResponses;
    }

    public ConversationResponse create(ConversationRequest request,String authHeader){
        ApiResponse<UserResponse> user = userClient.getUserByToken(authHeader);
        var userInfoResponse = user.getData();
        var participantInfoResponse = userClient.getUserByToken1(request.getParticipantIds().getFirst());

        if (Objects.isNull(userInfoResponse) || Objects.isNull(participantInfoResponse)) {
            throw new RuntimeException("UNCATEGORIZED EXCEPTION");
        }
        List<Long> userIds = new ArrayList<>();
        userIds.add(userInfoResponse.getUserId());
        userIds.add(participantInfoResponse.getData().getUserId());
        var sortedIds = userIds.stream().sorted().toList();
        StringBuilder hashBuilder = new StringBuilder();
        for (int i = 0; i < sortedIds.size(); i++) {
            hashBuilder.append(sortedIds.get(i));
            if (i < sortedIds.size() - 1) {
                hashBuilder.append("_");
            }
        }
        String userIdHash = hashBuilder.toString();
        var conversation = conversationRepository.findByParticipantsHash(userIdHash)
                .orElseGet(() -> {
                    List<UserResponse> participantInfos = new ArrayList<>();
                    List<Long> userIds1 = new ArrayList<>();
                    userIds1.add(userInfoResponse.getUserId());
                    participantInfos.add(UserResponse.builder()
                            .userId(userInfoResponse.getUserId())
                            .nameOfUser(userInfoResponse.getNameOfUser())
                            .email(userInfoResponse.getEmail())
                            .address(userInfoResponse.getAddress())
                            .build());
                    participantInfos.add(UserResponse.builder()
                            .userId(participantInfoResponse.getData().getUserId())
                            .nameOfUser(participantInfoResponse.getData().getNameOfUser())
                            .email(participantInfoResponse.getData().getEmail())
                            .address(participantInfoResponse.getData().getAddress())
                            .build());

                    Conversation newConversation = Conversation.builder()
                            .type(request.getType())
                            .participantsHash(userIdHash)
                            .createdDate(Instant.now())
                            .modifiedDate(Instant.now())
                            .users(userIds)
                            .build();

                    return conversationRepository.save(newConversation);
                });
        return conversationMapper.toConversationResponse(conversation);
    }


}
