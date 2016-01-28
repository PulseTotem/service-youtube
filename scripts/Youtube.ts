/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../t6s-core/core-backend/scripts/server/SourceServer.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./YoutubeNamespaceManager.ts" />



/**
 * Represents the PulseTotem Youtube's Service.
 *
 * @class Youtube
 * @extends SourceServer
 */
class Youtube extends SourceServer {



    /**
     * Constructor.
     *
     * @param {number} listeningPort - Server's listening port..
     * @param {Array<string>} arguments - Server's command line arguments.
     */
    constructor(listeningPort : number, arguments : Array<string>) {
        super(listeningPort, arguments);

        this.init();
    }

    /**
     * Method to init the Twitter server.
     *
     * @method init
     */
    init() {
        var self = this;

        this.addNamespace("Youtube", YoutubeNamespaceManager);
    }
}

/**
 * Server's Youtube listening port.
 *
 * @property _YoutubeListeningPort
 * @type number
 * @private
 */
var _YoutubeListeningPort : number = process.env.PORT || 6004;

/**
 * Server's Youtube command line arguments.
 *
 * @property _YoutubeArguments
 * @type Array<string>
 * @private
 */
var _YoutubeArguments : Array<string> = process.argv;

var serverInstance = new Youtube(_YoutubeListeningPort, _YoutubeArguments);
serverInstance.run();