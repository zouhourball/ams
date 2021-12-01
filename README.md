# ams-regulator-reporting-fe

## commit messages must contain: 
```<type>(<scope>): <subject>```

  
### "type" must be one of the following mentioned below!

```build:``` Build related changes (eg: npm related/ adding external dependencies)</br>
```chore:``` A code change that external user won't see (eg: change to .gitignore file or .prettierrc file)</br>
```feat:``` A new feature</br>
```fix:``` A bug fix</br>
```docs:``` Documentation related changes</br>
```refactor:``` A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)</br>
```perf:``` A code that improves performance</br>
```style:``` A code that is related to styling</br>
```test:``` Adding new test or making changes to existing test</br>

 ### "scope" is optional
  
  Scope must be noun and it represents the section of the section of the codebase
  #### Example <scope> values:
      init
      runner
      watcher
      config
      web-server
      proxy
      etc.
  it can be empty if the change is a global or difficult to assign to a single component.
  
  ### "subject"
  
  name the changes you've made using the imperative, present tense: “change” not “changed” nor “changes”
