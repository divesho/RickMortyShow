# API server for Rick and Morty Show

APIs added to register, login the user. With provided token, access private APIs to get the list of show characters
and update user preferences in database

## Getting Started

Install dependencies with following command
```
npm install
```

setup mongodb and update `config.json` file.

## APIs

### Register

```
* API:      /register 
* Method:   POST
* Body:     {"uname": "username", "password: "password"}
* Response  { "_id" }
```

### Login

```
* API:      /login 
* Method:   POST
* Body:     {"uname": "username", "password: "password"}
* Response  { "_id", "uname", "preferences", "jwtToken" }
```

### Show Characters

```
* API:      /showCharacter 
* Method:   GET
* Headers:  { "Authorization": "JWT Token" }
* Response  [{ character data }, {}, ..]
```

### Filters

```
* API:      /filters 
* Method:   GET
* Headers:  { "Authorization": "JWT Token" }
* Response  { species: [ ..list of available options ], gender: [ ... ], origin: [ ... ] }
```

### Initial Data

```
* API:      /initData 
* Method:   GET
* Headers:  { "Authorization": "JWT Token" }
* Response  { characters: [ ... list of show characters ], filters: { ... list of filter options } }
```

### Filtered Data

```
* API:      /characters/filters 
* Method:   POST
* Body:     {"filters": { ... list of filter options }, "searchValue": "search by name", "sortValue": "sort by id" }
* Headers:  { "Authorization": "JWT Token" }
* Response  [{ character data }, {}, ..]
```