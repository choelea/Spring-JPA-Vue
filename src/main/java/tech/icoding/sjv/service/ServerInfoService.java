package tech.icoding.sjv.service;

import org.springframework.stereotype.Service;
import tech.icoding.sjv.exception.BadRequestException;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.repository.ClientInfoRepository;
import tech.icoding.sjv.repository.ServerInfoRepository;
import tech.icoding.sjv.util.CustomSqlServerConnector;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Currency;
import java.util.List;

@Service
public class ServerInfoService {

    private final ServerInfoRepository repository;
    private final ClientInfoRepository clientInfoRepository;
    private final CustomSqlServerConnector customSqlServerConnector;

    public ServerInfoService(ServerInfoRepository repository, ClientInfoRepository clientInfoRepository, CustomSqlServerConnector customSqlServerConnector) {
        this.repository = repository;
        this.clientInfoRepository = clientInfoRepository;
        this.customSqlServerConnector = customSqlServerConnector;
    }

    public List<ServerInfo> findAll() {
        return repository.findAll();
    }


    public ServerInfo save(ServerInfo serverInfo) throws Exception {
        boolean validatedConnection = customSqlServerConnector.validateConnection(serverInfo.getAddress(),
                serverInfo.getPort(),
                serverInfo.getUsername(),
                serverInfo.getPassword());
        if(!validatedConnection) throw new BadRequestException("配置信息有误，无法链接数据库");
        return repository.save(serverInfo);
    }

    public ServerInfo findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * 删除某个服务器信息；删除前需要检查是否有客户使用该服务器，如果有抛出异常
     * @param id
     */
    public void delete(Long id) {
        boolean existsByServerId = clientInfoRepository.existsByServerId(id);
        if(existsByServerId) {
            throw new BadRequestException("该服务器有客户使用，无法删除");
        }
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

        Connection connection = customSqlServerConnector.createConnection(serverInfo.getAddress(), serverInfo.getPort(), serverInfo.getUsername(), serverInfo.getPassword());

        customSqlServerConnector.disableDatabase(connection,dataBaseName);
        customSqlServerConnector.closeConnection(connection);
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
        Connection connection = customSqlServerConnector.createConnection(serverInfo.getAddress(), serverInfo.getPort(), serverInfo.getUsername(), serverInfo.getPassword());
        customSqlServerConnector.enableDatabase(connection, dataBaseName);
        customSqlServerConnector.closeConnection(connection);
        return true;
    }

    /**
     * 获取服务器上的所有数据库的名字
     */
    public String[] getDatabaseNames(Long id) throws SQLException {
        ServerInfo serverInfo = repository.findById(id).get();
        Connection connection = customSqlServerConnector.createConnection(serverInfo.getAddress(), serverInfo.getPort(), serverInfo.getUsername(), serverInfo.getPassword());
        String[] databaseNames = customSqlServerConnector.getDatabaseNames(connection);
        customSqlServerConnector.closeConnection(connection);
        return databaseNames;
    }
}