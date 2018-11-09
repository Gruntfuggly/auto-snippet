var vscode = require( 'vscode' );
var path = require( 'path' );

function activate( context )
{
    context.subscriptions.push( vscode.workspace.onDidOpenTextDocument( function( document )
    {
        if( document )
        {
            var text = document.getText();
            if( text.length === 0 )
            {
                var extension = path.extname( document.fileName ).substr( 1 );
                var mappings = vscode.workspace.getConfiguration( 'autoSnippet' ).get( 'snippets' );
                if( mappings[ extension ] !== undefined )
                {
                    var insertedTimeout = setTimeout( function()
                    {
                        vscode.window.showErrorMessage( "Missing or empty snippet: " + mappings[ extension ] );
                    }, 1000 );
                    vscode.commands.executeCommand( 'editor.action.insertSnippet', { name: mappings[ extension ] } ).then( function()
                    {
                        clearTimeout( insertedTimeout );
                    } );
                }
            }
        }
    } ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
