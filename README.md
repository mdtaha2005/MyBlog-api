# Blog API

This is the backend API for a dynamic blog website, built using **Express.js** and **MySQL**. The API provides endpoints for user authentication, blog post management, and secure data handling. It includes features such as user registration, login with JWT authentication, and CRUD operations for blog posts.

## **Features**
- **User Authentication**: Secure registration and login using bcrypt for password hashing and JWT for authentication.
- **CRUD Operations**: Create, Read, Update, and Delete blog posts.
- **Tag-Based Filtering**: Retrieve posts based on specific tags.
- **CORS Enabled**: Allows frontend requests from different origins.
- **MySQL Database**: Efficient and scalable storage for blog posts and user data.

## **Technologies Used**
- **Backend Framework**: Node.js with Express.js
- **Database**: MySQL
- **Authentication**: JWT and bcrypt
- **Middleware**: CORS and body-parser

## **Project Structure**
```
/blog-api
│── app.js            # Main server file
│── package.json      # Dependencies and scripts
│── README.md         # Project documentation
│── .env.example      # Example environment variables file
```

## **Setup Instructions**

### **1. Clone this repository**
```sh
git clone https://github.com/your-username/blog-api.git
cd blog-api
```

### **2. Install dependencies**
```sh
npm install
```

### **3. Configure your MySQL database**
- Create a database named `blogapi`.
- Ensure you have `users` and `posts` tables (schema setup included in `app.js`).

### **4. Start the server**
```sh
node app.js
```
The server will run on `http://localhost:3000/`.

## **API Endpoints**

### **User Authentication**
| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| POST   | `/api/register` | Register a new user      |
| POST   | `/api/login`    | Authenticate a user      |

### **Blog Post Management**
| Method | Endpoint              | Description               |
|--------|------------------------|---------------------------|
| POST   | `/api/posts`           | Create a new blog post    |
| GET    | `/api/posts`           | Retrieve all blog posts   |
| GET    | `/api/posts/:id`       | Get a specific post       |
| PUT    | `/api/posts/:id`       | Update a blog post        |
| DELETE | `/api/posts/:id`       | Delete a blog post        |
| GET    | `/api/posts/category/:tag` | Get posts by tag    |

## **Security Measures**
- **Password Hashing**: Uses bcrypt to store passwords securely.
- **JWT Authentication**: Ensures secure access to protected routes.
- **Input Validation**: Prevents SQL injections and other vulnerabilities.

## **Frontend Integration**
The frontend for this project is hosted separately. You can find it here:
🔗 **[Frontend Repository](https://github.com/mdtaha2005/Blog-website)**


## **Contact**
For any questions, issues, or contributions, feel free to open an issue or reach out.

Happy coding! 🚀

