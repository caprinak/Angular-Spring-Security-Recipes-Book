# H2 Database Console Access Guide

## Introduction

This guide explains how to access the H2 database console in the Recipe Book application. The H2 console is a web-based tool that allows you to view and interact with your H2 database directly from your browser.

## Configuration Changes Made

To enable access to the H2 console, the following changes were made:

1. **Enabled H2 Console in application.properties**:
   ```properties
   # H2 Console Configuration
   spring.h2.console.enabled=true
   spring.h2.console.path=/h2-console
   ```

2. **Updated Security Configuration to allow H2 Console access**:
   - Disabled CSRF protection for H2 console paths
   - Configured frame options to allow same-origin frames (required for H2 console)
   - Explicitly permitted all requests to the H2 console path

## Accessing the H2 Console

1. Start the application
2. Open your browser and navigate to: `http://localhost:8080/h2-console`
3. You should see the H2 Console login page

## Connection Settings

When connecting to the H2 database, use these settings:

### For Test Environment:
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

### For Main Application (if using H2):
- JDBC URL: Check the URL in your application.properties
- Username and password as configured in your application.properties

## Using the H2 Console

Once connected, you can:
- Browse tables
- Execute SQL queries
- View database structure
- Modify data (be careful in production environments)

## Troubleshooting

If you cannot access the H2 console:

1. Verify the application is running
2. Check that you're using the correct URL
3. Ensure the security configuration is correctly set up
4. Check application logs for any errors related to H2 or security

## Security Considerations

The H2 console is a powerful tool that provides direct access to your database. In production environments:

1. Disable the H2 console or restrict access to trusted IPs
2. Use strong passwords
3. Consider using a more robust database solution like MySQL or PostgreSQL

## Related Documentation

- [H2 Database Documentation](https://www.h2database.com/html/main.html)
- [Spring Boot H2 Database Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.sql.h2-web-console)