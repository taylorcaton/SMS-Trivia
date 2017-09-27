OpenTrivia API
===============

[![Build Status](https://travis-ci.org/sbardian/openTriviaAPI.svg?branch=dev)](https://travis-ci.org/sbardian/openTriviaAPI) [![Coverage Status](https://coveralls.io/repos/github/sbardian/openTriviaAPI/badge.svg?branch=dev)](https://coveralls.io/github/sbardian/openTriviaAPI?branch=dev)

#### Special thanks to [wKovacs64](https://github.com/wKovacs64 "wKovacs64"), he saved me hours of google time!

### File structure: 
```
    ./src
        index.js
        openTriviaAPI.js
        responses.js
    ./test
        test.js
```

### index.js
    Application entry point. 

### openTrivia.js
##### Core Functions: 
 Function | Description 
 --- | ---
 _axios()  | Create axios instance. (Not for General use)
 _fetchFromAPI() | Makes our calls to API. (Not for General use)
 getQuestions() | Get questions from API.

##### Helper functions:
 Function | Description
 --- | ---
 getToken()       | Get a token from API.
 resetToken()     | Reset token.
 *listCategories() | Lists Category options to console.
 *listDificulty()  | Lists Difficulty options to console.
 *listTypes()      | Lists Type options to console.
 *listEncoding()   | Lists Encoding options to console.
     * - Not yet implemented. . .

### responses.js
```
    Exposes the API response values to our app.
```


### API query specifics: 
```
    options = {
        amount: {Number}        // Amount of questions, null=1,
        category: {Number}      // use category.js, null=any,
        difficulty: {String}    // (easy, medium, hard), null=any,
        type: {String}          // (multiple, boolean), null=any,
        encode: {string}        // (url3986, base64), null=default encoding
    }
```

### Query options: 

Amount {Number}: 

Value | Description
---|---
1 - 50 | any Integer between 1 and 50.

```
Example:   options = { 
                amount: 35
            }
```

Category {Number}: 

Value | Name
--- | ---
 "null" | Any category
 9  | General Knowledge
 10 | Entertainment: Books
 11 | Entertainment: Film
 12 | Entertainment: Music
 13 | Entertainment: Musicals & Theatres
 14 | Entertainment: Television
 15 | Entertainment: Video Games
 16 | Entertainment: Board Games
 17 | Science & Nature
 18 | Science: Computers
 19 | Science: Mathematics
 20 | Mythology
 21 | Sports
 22 | Geography
 23 | History
 24 | Politics
 25 | Art
 26 | Celebrities
 27 | Animals
 
 ```
 Example:   options = { 
                 category: 18
             }
 ```
 
 Difficulty {String}: 
 
  Values | Description
 ---- | ---
 "null" | Any difficulty
 easy | Only easy questions
 medium | Only medium questions
 difficult | Only difficult questions
 
 ```
 Example:   options = { 
                 type: 'medium'
             }
 ```
 
 Type {String}: 
 
 Value | Description
 --- | ---
  "null"  | Any type of questions
 multiple | Multiple choice questions only
 boolean  | True / False questions only
 
 ```
 Example:   options = { 
                 type: 'multiple'
             }
 ```
 
 Encode {String}:
 
 Value | Description
 --- | ---
   "null"  | Default Encoding HTML codes
 url3986 | URL Encoding (RFC 3986)
 base64 | Base64 encoding
 
 ```
 Example:   options = { 
                 encode: 'url3986'
             }
 ```
 
 Token {String}:
 
 Value | Description
 --- | ---
 "null" | No token in query
 "token" | Use getToken() to get a token
 
 ```
 Example: 
      let token;
      opentriviaapi.getToken()
        .then((data) => {
            token = data.token;
        });
        
      opentriviaapi.getQuestions({token: token})
        .then((data) => {
            console.log(data);
        });
 ```


Combined:
```
Example:   options = { 
                amount: 35,
                category: 18,
                difficulty: 'easy',
                type: 'multiple',
                encode: 'url3986',
                token: token,
            }
```