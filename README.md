# AI-Powered Document Search Web Application

This repository contains the source code for a web application designed for businesses that require **AI-assisted document search capabilities**. The application allows users to perform searches using natural language criteria, providing an intuitive and efficient way to find relevant information within their document databases.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Usage](#usage)


---

## Project Overview

The application offers an AI-powered document search system that enables users to input search criteria in natural language. The core functionality is built around a **custom authentication system** using **JWT tokens** to secure access.

A key feature of the app is its **Chatbot-powered search assistant**, which leverages OpenAI to provide intelligent responses based on a domain-specific database of "search knowledge." The backend handles user requests and forwards them to a microservice responsible for processing and returning results.

---

## Features

The application includes the following key features:

### Authentication
- Custom authentication system using JWT tokens
- Secure user session management

### AI Search Functionality
- Natural language input for document search
- Integration with OpenAI for intelligent query processing
- Domain-specific knowledge base for accurate results

### Chatbot Support
- Real-time chatbot for guided search assistance
- WebSocket-based interaction for low-latency responses

### Scalability and Modularity
- Microservice-based architecture for handling chat and AI requests
- Decoupled components for ease of maintenance

---

## Architecture

The application is built with a **modular architecture** for scalability and flexibility:

1. **Frontend:**  
   - Framework: **Angular**  
   - Provides an interactive and responsive user interface.  
   - Communicates with the backend via REST API and WebSockets.

2. **Backend:**  
   - Framework: **NestJS**  
   - Handles authentication, user management, and request routing to the microservice.

3. **Microservice:**  
   - Framework: **NestJS**  
   - Manages chat interactions with the AI assistant.  
   - Processes user requests and queries the knowledge base.  
   - Responds in real-time via WebSockets.

---

## Technologies Used

- **Frontend:** [Angular](https://angular.io/)
- **Backend & Microservice:** [NestJS](https://nestjs.com/)
- **AI Assistant:** [OpenAI API](https://openai.com/)
- **Database:** PostgreSQL for Production and SQLite for Development (for user management)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time Communication:** WebSockets
- **Deployment:** Docker (containerized services)

---

## Usage

1. **Sign Up/Login:**  
   Users authenticate using the secure login system.

2. **Perform a Search:**  
   Navigate to the search interface and input a query in natural language.

3. **Chat with Search Bot:**  
   Use the integrated chatbot for assistance or clarification about search results.

---

