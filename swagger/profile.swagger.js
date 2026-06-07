module.exports = {
    "/api/register": {
        post: {
            summary: "User Regiter",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    example: "shivam"
                                },
                                email: {
                                    type: "string",
                                    example: "shivam@gmail.com"
                                },
                                password: {
                                    type: "string",
                                    example: "123456"
                                }
                            },
                            required: ["email", "password"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Success"
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        }
    },
    "/api/login": {
        post: {
            summary: "User Login",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "shivam@gmail.com"
                                },
                                password: {
                                    type: "string",
                                    example: "123456"
                                }
                            },
                            required: ["email", "password"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Success"
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        }
    },
    "/api/profile": {
        get: {
            summary: "User Profile Api",
            parameters: [
                {
                    in: "query",
                    name: "name",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    example: "Shivam",
                },
                {
                    in: "query",
                    name: "email",
                    required:false,
                    schema: {
                        type: "string"
                    },
                    example: "shivam@gmail.com",
                }
            ],
            responses: {
                200: {
                    description: "Success"
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        }
    }
};