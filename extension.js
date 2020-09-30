var vscode = require( 'vscode' );
var path = require( 'path' );
var micromatch = require( 'micromatch' );

function activate( context )
{
    var outputChannel;

    function debug( text )
    {
        if( outputChannel )
        {
            outputChannel.appendLine( text );
        }
    }

    function resetOutputChannel()
    {
        if( outputChannel )
        {
            outputChannel.dispose();
            outputChannel = undefined;
        }
        if( vscode.workspace.getConfiguration( 'autoSnippet' ).debug === true )
        {
            outputChannel = vscode.window.createOutputChannel( "Auto Snippet" );
        }
    }

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
        function runCommands( commands )
        {
            if( Array.isArray( commands ) )
            {
                commands.map( function( command )
                {
                    debug( " Running command: " + command );
                    vscode.commands.executeCommand( command );
                } );
            }
        }

        if( document )
        {
            var text = document.getText();
            if( text.length === 0 )
            {
                var mappings = vscode.workspace.getConfiguration( 'autoSnippet' ).get( 'snippets' );

                var filename = document.fileName;
                var found = false;

                debug( "Opened empty file " + filename );

                for( var m = 0; m < mappings.length; ++m )
                {
                    var languageMatch = mappings[ m ].language && mappings[ m ].language === document.languageId;
                    var nameMatch = mappings[ m ].pattern && micromatch.isMatch( filename, mappings[ m ].pattern );

                    if( languageMatch )
                    {
                        debug( " Matched language " + document.languageId );
                    }
                    if( nameMatch )
                    {
                        debug( " Matched pattern " + mappings[ m ].pattern );
                    }

                    if( languageMatch || nameMatch )
                    {
                        found = true;

                        vscode.window.showTextDocument( document, false );

                        vscode.commands.executeCommand( 'editor.action.selectAll' ).then( function()
                        {
                            if( mappings[ m ].snippet === undefined )
                            {
                                runCommands( mappings[ m ].commands );
                            }
                            else
                            {
                                debug( " Inserting snippet " + mappings[ m ].snippet );
                                var insertedTimeout = setTimeout( function()
                                {
                                    vscode.window.showErrorMessage( "Missing, empty or invalid snippet: " + mappings[ m ].snippet );
                                }, 1000 );
                                vscode.commands.executeCommand( 'editor.action.insertSnippet', { name: mappings[ m ].snippet } ).then( function()
                                {
                                    clearTimeout( insertedTimeout );
                                    runCommands( mappings[ m ].commands );
                                } );
                            }
                        } );
                        break;
                    }
                }

                if( found !== true )
                {
                    debug( " No snippet found" );
                }

            }
        }
    } ) );

    context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
    {
        if( e.affectsConfiguration( "autoSnippet" ) )
        {
            if( e.affectsConfiguration( "autoSnippet.debug" ) )
            {
                resetOutputChannel();
            }
        }
    } ) );

    resetOutputChannel();
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
