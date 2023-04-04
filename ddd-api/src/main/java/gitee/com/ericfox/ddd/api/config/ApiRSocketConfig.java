package gitee.com.ericfox.ddd.api.config;

import io.rsocket.transport.netty.client.TcpClientTransport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.codec.cbor.Jackson2CborDecoder;
import org.springframework.http.codec.cbor.Jackson2CborEncoder;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.messaging.rsocket.RSocketStrategies;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Configuration
public class ApiRSocketConfig {
    /**
     * 配置策略，编码解码
     */
    @Bean
    public RSocketStrategies rSocketStrategies() {
        /*CompositeByteBuf metadata = ByteBufAllocator.DEFAULT.compositeBuffer();
        RoutingMetadata routingMetadata = TaggingMetadataCodec.createRoutingMetadata(
                ByteBufAllocator.DEFAULT,
                CollUtil.newArrayList(
                        "AppFrameworkStarterSdkController.remindCommand",
                        "AppFrameworkStarterSdkController.execute"
                )
        );
        CompositeMetadataCodec.encodeAndAddMetadata(metadata,
                ByteBufAllocator.DEFAULT,
                WellKnownMimeType.MESSAGE_RSOCKET_ROUTING,
                routingMetadata.getContent());*/
        return RSocketStrategies
                .builder()
                .encoder(new Jackson2CborEncoder()) //, CharSequenceEncoder.allMimeTypes()
                .decoder(new Jackson2CborDecoder()) //, StringDecoder.textPlainOnly()
                .build();
    }

    /**
     * RSocket连接策略
     */
    @Bean
    public Mono<RSocketRequester> monoRequester(RSocketRequester.Builder builder) {
        return Mono.just(
                builder
                        .rsocketConnector(connector -> connector.reconnect(Retry.fixedDelay(2, Duration.ofSeconds(2))))
                        .dataMimeType(MediaType.APPLICATION_CBOR)
//                        .dataMimeType(new MimeType("message", "x.rsocket.routing.v0"))
                        .transport(TcpClientTransport.create(3001))
        );
    }

    @Bean
    public Flux<RSocketRequester> fluxRequester(RSocketRequester.Builder builder) {
        return Flux.just(
                builder
                        .rsocketConnector(connector -> connector.reconnect(Retry.fixedDelay(2, Duration.ofSeconds(2))))
                        .dataMimeType(MediaType.APPLICATION_CBOR)
//                        .dataMimeType(new MimeType("message", "x.rsocket.routing.v0"))
                        .transport(TcpClientTransport.create(3001))
        );
    }
}
