# Database Migration Guide for Recipe Book Application

## Introduction

This guide outlines the steps to incorporate database migrations into the Recipe Book application. As the application evolves, database schema changes will need to be managed in a controlled, versioned manner. Database migrations provide a way to:

- Track database schema changes in version control
- Apply changes consistently across all environments
- Roll back changes if necessary
- Support team collaboration on database changes
- Ensure data integrity during schema updates

## Comparison of Migration Tools

After evaluating the available options, **Flyway** is recommended for this project for the following reasons:

| Feature | Flyway | Liquibase |
|---------|--------|-----------|
| **Simplicity** | ✅ Simple SQL-based migrations | More complex XML/YAML/JSON/SQL formats |
| **Spring Boot Integration** | ✅ Excellent native integration | Good integration but more configuration |
| **Learning Curve** | ✅ Low - SQL knowledge is sufficient | Medium - Requires learning specific formats |
| **Flexibility** | Good for most use cases | ✅ More powerful for complex scenarios |
| **Community Support** | ✅ Strong community and documentation | Strong community and documentation |
| **Free Version Features** | ✅ Comprehensive free version | Some limitations in free version |

## Implementation Steps

### 1. Add Flyway Dependency

Add the following dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

<!-- For MySQL support -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

### 2. Configure Flyway in application.properties

Add the following configuration to your `application.properties` file:

```properties
# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-version=0
```

For test environments, you may want to add this to your `application-test.properties`:

```properties
# Disable Flyway for tests if using H2 in-memory database with create-drop mode
spring.flyway.enabled=false
```

### 3. Create Migration Directory Structure

Create the following directory structure:

```
src/main/resources/db/migration/
```

### 4. Create Initial Migration Script

Create your first migration script to establish the baseline schema. Name it according to Flyway's naming convention:

```
V1__Initial_schema.sql
```

The content should create your initial tables. For example:

```sql
-- Create Recipe table
CREATE TABLE IF NOT EXISTS recipe (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    image_path VARCHAR(255),
    category VARCHAR(50)
);

-- Create Ingredient table
CREATE TABLE IF NOT EXISTS ingredient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount VARCHAR(50),
    units VARCHAR(50),
    recipe_id BIGINT,
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

### 5. Run Your Application

When you run your application, Flyway will:
1. Create a `flyway_schema_history` table to track migrations
2. Execute any pending migration scripts in order

## Creating New Migrations

As your application evolves, you'll need to create new migration scripts for schema changes:

1. Create a new SQL file in the `db/migration` directory
2. Name it using Flyway's versioning convention: `V2__Add_favorite_recipes.sql`, `V3__Modify_recipe_description.sql`, etc.
3. Write the SQL to implement your changes

Example migration to add a favorites table:

```sql
-- V2__Add_favorite_recipes.sql
CREATE TABLE favorite_recipe (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, recipe_id)
);
```

## Common Migration Scenarios

### Adding a New Table

```sql
CREATE TABLE new_table (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);
```

### Adding a Column to an Existing Table

```sql
ALTER TABLE recipe 
ADD COLUMN preparation_time INT;
```

### Modifying a Column

```sql
ALTER TABLE recipe 
MODIFY COLUMN description VARCHAR(4000);
```

### Adding an Index

```sql
CREATE INDEX idx_recipe_name ON recipe(name);
```

### Adding Foreign Key Constraints

```sql
ALTER TABLE ingredient
ADD CONSTRAINT fk_recipe_ingredient
FOREIGN KEY (recipe_id) REFERENCES recipe(id);
```

## Best Practices

1. **Keep migrations small and focused**: Each migration should make a small, specific change to the schema.

2. **Never modify existing migration scripts**: Once a migration has been applied to any environment, treat it as immutable.

3. **Version control your migrations**: Keep all migration scripts in your version control system.

4. **Test migrations thoroughly**: Test each migration in a development environment before applying it to production.

5. **Include both "up" and "down" logic**: For complex migrations, consider creating companion "undo" scripts.

6. **Use descriptive names**: Name your migration files descriptively to understand their purpose at a glance.

7. **Handle data migrations carefully**: When changing schema, consider how existing data will be affected.

8. **Use transactions**: Ensure your migrations are wrapped in transactions when possible.

9. **Document complex migrations**: Add comments to explain the reasoning behind complex changes.

10. **Coordinate with application code changes**: Ensure your application code is compatible with both the old and new schema during deployment.

## Testing Migrations

1. **Use a dedicated test database**: Never test migrations on production data.

2. **Automate migration testing**: Include migration testing in your CI/CD pipeline.

3. **Test rollbacks**: Verify that you can successfully roll back migrations if needed.

4. **Test with realistic data volumes**: Large tables may behave differently during migrations.

## Handling Different Environments

For different environments, you can customize Flyway's behavior:

```properties
# Development
spring.flyway.clean-on-validation-error=true  # Only in development!

# Production
spring.flyway.clean-disabled=true  # Prevent accidental data loss
spring.flyway.baseline-on-migrate=true  # For first-time migration on existing DB
```

## Troubleshooting

### Migration Checksum Mismatch

If you get a checksum mismatch error, it means a previously applied migration script has been changed. Never modify existing migration scripts; instead, create a new migration to make additional changes.

### Failed Migrations

If a migration fails:
1. Check the error message for specific SQL issues
2. Fix the issue in a new migration script
3. In development, you may need to repair the Flyway schema history table:
   ```
   spring.flyway.repair=true
   ```

### Schema Already Exists

If you're adding Flyway to an existing application with data:
1. Set `spring.flyway.baseline-on-migrate=true`
2. Create a V1 migration that matches your existing schema

## Conclusion

By implementing Flyway for database migrations, the Recipe Book application wily across envirol have a robust system for managing schema changes throughout its lifecycle. This approach ensures consistencnments, provides version control for database changes, and makes collaboration easier for the development team.

For more information, refer to the [official Flyway documentation](https://flywaydb.org/documentation/).