package com.example.reciperestapi.migration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Test class to verify Flyway migrations are working correctly.
 * This test uses a specific test profile that enables Flyway with H2 database.
 */
@SpringBootTest
@TestPropertySource(properties = {
        "spring.flyway.enabled=true",
        "spring.flyway.baseline-on-migrate=true",
        "spring.flyway.locations=classpath:db/migration",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.username=sa",
        "spring.datasource.password=password",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "logging.level.org.flywaydb=DEBUG",
        "logging.level.org.hibernate.SQL=DEBUG"
})
public class FlywayMigrationTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testMigrations() throws SQLException {
        // Verify that the flyway_schema_history table exists
        assertTrue(tableExists("flyway_schema_history"), "Flyway schema history table should exist");

        // Verify that our tables from migrations exist
        assertTrue(tableExists("recipe"), "Recipe table should exist");
        assertTrue(tableExists("ingredient"), "Ingredient table should exist");
        assertTrue(tableExists("users"), "Users table should exist");
        assertTrue(tableExists("favorite_recipe"), "Favorite recipe table should exist");

        // Verify that the migrations were applied in order
        List<String> appliedMigrations = getAppliedMigrations();
        assertTrue(appliedMigrations.contains("V1__Initial_schema"), "V1 migration should be applied");
        assertTrue(appliedMigrations.contains("V2__Add_favorite_recipes"), "V2 migration should be applied");

        System.out.println("[DEBUG_LOG] All Flyway migrations were applied successfully");
    }

    private boolean tableExists(String tableName) throws SQLException {
        try (Connection conn = dataSource.getConnection()) {
            ResultSet tables = conn.getMetaData().getTables(null, null, tableName.toUpperCase(), null);
            return tables.next();
        }
    }

    private List<String> getAppliedMigrations() {
        return jdbcTemplate.query(
                "SELECT description FROM flyway_schema_history WHERE success = 1 ORDER BY installed_rank",
                (rs, rowNum) -> rs.getString("description")
        );
    }
}
