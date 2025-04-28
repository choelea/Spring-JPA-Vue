package tech.icoding.sjv;

import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.model.User;
import tech.icoding.sjv.model.payload.JwtAuthenticationResponse;
import tech.icoding.sjv.model.payload.LoginRequest;
import tech.icoding.sjv.model.payload.RegistrationRequest;
import tech.icoding.sjv.model.payload.ServerInfoRequest;
import tech.icoding.sjv.repository.*;
import tech.icoding.sjv.service.AuthService;
import tech.icoding.sjv.service.UserService;

import javax.annotation.PostConstruct;
import java.nio.charset.Charset;
import java.util.Optional;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Slf4j
public class  ClientInfoIntegrationTest {

	@Autowired
	protected MockMvc mockMvc;

	@Autowired
	private ClientInfoRepository clientInfoRepository;

	@Autowired
	private ServerInfoRepository serverInfoRepository;

	@Autowired
	protected RefreshTokenRepository refreshTokenRepository;
	@Autowired
	protected ServerProperties serverProperties;
	@Autowired
	protected AuthService authService;

	@Autowired
	protected UserRepository userRepository;

	@Autowired
	protected EmailVerificationTokenRepository emailVerificationTokenRepository;
	protected String baseUrl;

	private String jwtToken;

	public ClientInfoIntegrationTest() {
	}

	@PostConstruct
	public void init(){
		this.baseUrl = "http://localhost:"+serverProperties.getPort();
	}

	@Test
	public void intTest()  {
		try {
			registerUser();
			getJwtToken();
			createServerInfo();
		} catch (Exception e) {
			log.info(e.getMessage(),e);
		}
	}


	@Transactional
	protected void registerUser() throws Exception{
		log.info("开始测试登录创建 token");
		RegistrationRequest request = new RegistrationRequest();
		request.setEmail("joe.lea@foxmail.com");
		request.setPassword("admin#123");
		request.setUsername("admin");
		request.setRegisterAsAdmin(Boolean.TRUE);

		Optional<User> user = authService.registerUser(request);
		user.get().setEmailVerified(Boolean.TRUE);
		userRepository.save(user.get());
//		user.setEmailVerified(Boolean.TRUE);
//		userService.save(user);
	}

	protected void getJwtToken() throws Exception{
		LoginRequest request = new LoginRequest();
		request.setUsername("admin");
		request.setPassword("admin#123");

		final MvcResult mvcResult = this.mockMvc
				.perform(MockMvcRequestBuilders.post("/api/auth/login")
//						.header("Authorization", "bear ")
						.contentType(MediaType.APPLICATION_JSON)
						.content(JSON.toJSONString(request)))
				.andReturn();
		String contentAsString = mvcResult.getResponse().getContentAsString(Charset.forName("UTF-8"));
		log.info("登录返回: {}", contentAsString);
		JwtAuthenticationResponse jwtAuthenticationResponse = JSON.parseObject(contentAsString, JwtAuthenticationResponse.class);
		jwtToken = jwtAuthenticationResponse.getAccessToken();
	}

	protected void createServerInfo() throws Exception{
		log.info("开始测试创建服务器");
		// Mock ServerInfoRequest 表单
		ServerInfoRequest serverInfoRequest = new ServerInfoRequest();
		serverInfoRequest.setAddress("129.0.0.3");
		serverInfoRequest.setAlias("Server-1");
		serverInfoRequest.setPort(1433);
		serverInfoRequest.setUsername("sa");
		serverInfoRequest.setPassword("pasdaf#adf");


		final MvcResult mvcResult = this.mockMvc
				.perform(MockMvcRequestBuilders.post("/api/servers")
						.header("Authorization", "Bearer "+jwtToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(JSON.toJSONString(serverInfoRequest)))
				.andReturn();
		String contentAsString = mvcResult.getResponse().getContentAsString(Charset.forName("UTF-8"));
		log.info("创建服务器返回: {}", contentAsString);
		ServerInfo serverInfo = JSON.parseObject(contentAsString, ServerInfo.class);
		Assert.assertEquals( serverInfoRequest.getAddress(), serverInfo.getAddress());
	}
	

	@After
	public void clean(){
		log.info("---------开始清理工作-------");
		clientInfoRepository.deleteAll();
		serverInfoRepository.deleteAll();
		refreshTokenRepository.deleteAll();
		emailVerificationTokenRepository.deleteAll();
		userRepository.deleteAll();
	}

}
