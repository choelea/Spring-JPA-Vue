package tech.icoding.sjv.service;

import org.springframework.stereotype.Service;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.repository.ServerInfoRepository;
import tech.icoding.sjv.util.CustomSqlServerConnector;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Currency;
import java.util.List;

@Service
public class ServerInfoService {

    private final ServerInfoRepository repository;

    public ServerInfoService(ServerInfoRepository repository) {
        this.repository = repository;
    }

    public List<ServerInfo> findAll() {
        return repository.findAll();
    }

    public ServerInfo save(ServerInfo serverInfo) throws Exception {
        boolean validatedConnection = CustomSqlServerConnector.validateConnection(serverInfo.getAddress(),
                serverInfo.getPort(),
                serverInfo.getUsername(),
                serverInfo.getPassword());
        if(!validatedConnection) throw new Exception("配置信息有误，无法链接数据库");
        enableDatabase(serverInfo, "A客户管理");
        return repository.save(serverInfo);
    }

    public ServerInfo findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    /**
     * 禁用某个库
     * @param serverInfo
     * @param dataBaseName
     * @return
     * @throws SQLException
     */
    public Boolean disableDatabase(ServerInfo serverInfo, String dataBaseName) throws SQLException {

        Connection connection = CustomSqlServerConnector.createConnection(serverInfo.getAddress(), serverInfo.getPort(), serverInfo.getUsername(), serverInfo.getPassword());

        CustomSqlServerConnector.disableDatabase(connection,dataBaseName);
        CustomSqlServerConnector.closeConnection(connection);
        return true;
    }

    /**
     * 启用某个库
     * @param serverInfo
     * @param dataBaseName
     * @return
     * @throws SQLException
     */
    public Boolean enableDatabase(ServerInfo serverInfo, String dataBaseName) throws SQLException {
        Connection connection = CustomSqlServerConnector.createConnection(serverInfo.getAddress(), serverInfo.getPort(), serverInfo.getUsername(), serverInfo.getPassword());
        CustomSqlServerConnector.enableDatabase(connection, dataBaseName);
        CustomSqlServerConnector.closeConnection(connection);
        return true;
    }
}