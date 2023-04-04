package gitee.com.ericfox.ddd.infrastructure.config;

import io.r2dbc.spi.Connection;
import io.r2dbc.spi.ConnectionFactory;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class R2dbcConfig {
    @Resource
    ConnectionFactory connectionFactory;

    @Bean
    public Mono<Connection> connectionMono() {
        return Mono.from(connectionFactory.create());
    }

//    @Bean
//    public R2dbcEntityTemplate r2dbcEntityTemplate() {
//        MySqlConnectionConfiguration connectionConfiguration = MySqlConnectionConfiguration.builder()
//                .port(3306)
//                .database()
//                .build();
//        ConnectionFactory connectionFactory = MySqlConnectionFactory.from(connectionConfiguration);
//        return new R2dbcEntityTemplate(connectionFactory);
//    }
}
