package gitee.com.ericfox.ddd.starter.sdk.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

/**
 * sdk websocket handler
 */
@Service
@Slf4j
public class StarterSdkWebsocketHandler implements WebSocketHandler {
    /**
     * 建立连接
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("建立连接，id： {}", session.getId());
    }

    /**
     * 接收消息
     */
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
        Object payload = message.getPayload();
        System.err.println("接受消息" + payload);
        // Code to handle incoming messages
    }

    /**
     * 传输失败
     */
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        // Code to handle transport errors
    }

    /**
     * 断开连接
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) {
        // Code to execute after connection is closed
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
