Steps So Far
------------
0. Install / Modify boilerplate:
 - https://github.com/gaearon/react-hot-boilerplate
 - Modified: 
   - update eslint
   - update eslint-plugin-react
   - npm install eslint-config-airbnb
   - add .eslintrc:
     ```
        {
            "extends": "airbnb",
            "parser": "babel-eslint"
        }
     ```
	- add .babelrc:
     ```
        {
           "presets": ["es2015", "react", "stage-0"]
        }
