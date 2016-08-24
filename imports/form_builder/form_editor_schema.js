{
    "checkboxes": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "configs": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string"
                            },
                            "enum": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    },
                    "uniqueItems": {
                        "type": "boolean"
                    }
                }
            },
            "ui": {
                "type": "object",
                "properties": {
                    "ui:widget": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "radio":{
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "configs": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string"
                    },
                    "enum": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "ui": {
                "type": "object",
                "properties": {
                    "ui:widget": {
                        "type": "string"
                    }
                }
            }
        }
    }
}
