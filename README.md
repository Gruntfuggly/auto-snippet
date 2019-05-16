# Auto Snippet

This extension automatically inserts a predefined snippet when a file is created, or an empty file is opened.

This allows templates for classes etc. to be inserted with all the benefits of placeholders and regular expressions, etc.

## Configuration

There is one configuration setting which maps filename globs (or language IDs) to snippet names. You can also specified a comma separated list of commands to execute after inserting the snippet. *Note: The commands are not executed sequentially*.

Example:
```javascript
autoSnippet.snippets: [
    { "pattern": "ut-*.cpp", "snippet": "ut-template",
    { "pattern": "*.h", "snippet": "header-template" },
    { "pattern": "*.cpp", "snippet": "body-template",
    { "language": "javascript", "snippet": "template", "commands":"editor.action.commentLine" }
]
```

*Note: The patterns are matched in order of definition. The first one that matches will be used.*

Use F1, **Preferences: Configure User Snippets** to configure your snippets. For more information on configuration snippets, see [here](https://code.visualstudio.com/docs/editor/userdefinedsnippets).

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.auto-snippet).

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/auto-snippet).

## Credits

Icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>