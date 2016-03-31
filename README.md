Steps So Far
------------
1) Install / Modify boilerplate:
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
	- configure babel-loader `babel?presets[]=es2015&presets[]=react&presets[]=stage-0`