/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./sources/PlaylistInfo.ts" />

/**
 * Represents the Youtube's SourceNamespaceManager.
 *
 * @class YoutubeNamespaceManager
 * @extends SourceNamespaceManager
 */
class YoutubeNamespaceManager extends SourceNamespaceManager {

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);
	    this.addListenerToSocket('PlaylistInfo', function(params : any, self : YoutubeNamespaceManager) { (new PlaylistInfo(params, self)) });
    }
}