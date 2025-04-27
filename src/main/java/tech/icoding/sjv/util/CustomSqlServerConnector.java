package tech.icoding.sjv.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class CustomSqlServerConnector {

    public static Connection createConnection(String ip, int port, String username, String password) throws SQLException {
        DriverManager.setLoginTimeout(5);
        String url = String.format("jdbc:sqlserver://%s:%d;databaseName=A_CUSTOMER;encrypt=false;trustServerCertificate=true", ip, port);
        return DriverManager.getConnection(url, username, password);
    }

    public static boolean validateConnection(String ip, int port, String username, String password) {
        try (Connection connection = createConnection(ip, port, username, password);
             Statement stmt = connection.createStatement()) {
            stmt.executeQuery("SELECT 1");
            closeConnection(connection);
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 禁用指定数据库
     *
     * @param connection 连接对象
     * @param targetDbName 要禁用的数据库名
     */
    public static void disableDatabase(Connection connection, String targetDbName) {
        String sql = String.format("ALTER DATABASE [%s] SET OFFLINE WITH ROLLBACK IMMEDIATE", targetDbName);
        executeUpdate(connection, sql, "数据库 " + targetDbName + " 已被设为离线状态！", "禁用数据库失败！");
    }

    /**
     * 启用指定数据库
     *
     * @param connection 连接对象
     * @param targetDbName 要启用的数据库名
     */
    public static void enableDatabase(Connection connection, String targetDbName) {
        String sql = String.format("ALTER DATABASE [%s] SET ONLINE", targetDbName);
        executeUpdate(connection, sql, "数据库 " + targetDbName + " 已被设为在线状态！", "启用数据库失败！");
    }

    /**
     * 执行 SQL 更新语句的通用方法
     *
     * @param connection 数据库连接
     * @param sql 要执行的 SQL 语句
     * @param successMessage 成功时的提示信息
     * @param errorMessage 失败时的提示信息
     */
    private static void executeUpdate(Connection connection, String sql, String successMessage, String errorMessage) {
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate(sql);
            System.out.println(successMessage);
            closeConnection(connection);
        } catch (SQLException e) {
            System.err.println(errorMessage);
            e.printStackTrace();
        }
    }
}