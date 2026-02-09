# Deployment Guide

This guide explains how to deploy the Lumina Flipbook Pro application to a hosted server using Docker.

## Prerequisites

- A server (VPS, Cloud Instance, etc.) running Linux (Ubuntu/Debian recommended).
- [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on the server.

## Deployment Steps

1.  **Transfer Files**: Copy the project files to your server. You can use `scp`, `rsync`, or `git clone` if you push this to a repository.

    ```bash
    # Example using SCP (run from your local machine)
    scp -r /path/to/lumina-flipbook-pro user@your-server-ip:/path/to/destination
    ```

2.  **Navigate to Directory**: SSH into your server and go to the project folder.

    ```bash
    cd /path/to/destination
    ```

3.  **Start the Application**: Run the following command to build and start the container.

    ```bash
    docker-compose up -d --build
    ```

    - `-d`: Runs the container in detached mode (background).
    - `--build`: Forces a rebuild of the Docker image.

4.  **Verify Deployment**: Open your browser and navigate to your server's IP address (e.g., `http://your-server-ip`). You should see the application running.

## Management

-   **Stop the application**: `docker-compose down`
-   **View logs**: `docker-compose logs -f`
