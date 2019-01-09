var vscode = require( 'vscode' );
var path = require( 'path' );
var micromatch = require( 'micromatch' );

function activate( context )
{
    var mappings = vscode.workspace.getConfiguration( 'autoSnippet' ).get( 'snippets' );

    if( Array.isArray( mappings ) === false )
    {
        var migrated_mappings = [];
        Object.keys( mappings ).map( function( pattern )
        {
            migrated_mappings.push( {
                pattern: "*." + pattern,
                snippet: mappings[ pattern ]
            } );
        } );

        vscode.workspace.getConfiguration( 'autoSnippet' ).update( 'snippets', migrated_mappings, true );

        vscode.window.showInformationMessage( "\"autoSnippet.snippets\" setting has been migrated to the new format." );

        mappings = migrated_mappings;
    }

    context.subscriptions.push( vscode.workspace.onDidOpenTextDocument( function( document )
    {
        if( document )
        {
            var text = document.getText();
            if( text.length === 0 )
            {
                var filename = path.basename( document.fileName );

                for( var m = 0; m < mappings.length; ++m )
                {
                    if( micromatch.isMatch( filename, mappings[ m ].pattern ) )
                    {
                        var insertedTimeout = setTimeout( function()
                        {
                            vscode.window.showErrorMessage( "Missing or empty snippet: " + mappings[ m ].pattern );
                        }, 1000 );
                        vscode.commands.executeCommand( 'editor.action.insertSnippet', { name: mappings[ m ].snippet } ).then( function()
                        {
                            clearTimeout( insertedTimeout );
                        } );
                        break;
                    }
                };
            }
        }
    } ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
