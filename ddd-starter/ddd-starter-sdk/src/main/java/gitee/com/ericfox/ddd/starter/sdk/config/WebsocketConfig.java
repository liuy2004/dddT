package gitee.com.ericfox.ddd.starter.sdk.config;

import gitee.com.ericfox.ddd.starter.sdk.service.StarterSdkWebsocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * websocket配置
 */
@Configuration
@EnableWebSocket
@CrossOrigin("*")
public class WebsocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new StarterSdkWebsocketHandler(), "/starter/sdk/websocket").setAllowedOrigins("*");
    }
}