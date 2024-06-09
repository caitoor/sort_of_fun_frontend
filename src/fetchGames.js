// src/fetchGames.js
import { games } from './store';
import axios from 'axios';

async function fetchGameDetails(gameId) {
    const url = `https://api.geekdo.com/xmlapi2/thing?id=${gameId}`;
    console.log(`Fetching game details for ID ${gameId} from URL: ${url}...`);
    try {
        const response = await axios.get(url);
        const xmlText = response.data;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        const item = xmlDoc.getElementsByTagName('item')[0];

        if (!item) {
            console.error(`No item found for game ID ${gameId}`);
            return null;
        }

        return {
            id: item.getAttribute('id'),
            name: item.getElementsByTagName('name')[0]?.getAttribute('value') || 'Unknown',
            year: item.getElementsByTagName('yearpublished')[0]?.getAttribute('value') || 'Unknown',
            thumbnail: item.getElementsByTagName('thumbnail')[0]?.textContent || '',
            image: item.getElementsByTagName('image')[0]?.textContent || '',
            minPlayers: item.getElementsByTagName('minplayers')[0]?.getAttribute('value') || 'Unknown',
            maxPlayers: item.getElementsByTagName('maxplayers')[0]?.getAttribute('value') || 'Unknown',
            playingTime: item.getElementsByTagName('playingtime')[0]?.getAttribute('value') || 'Unknown',
            minPlayTime: item.getElementsByTagName('minplaytime')[0]?.getAttribute('value') || 'Unknown',
            maxPlayTime: item.getElementsByTagName('maxplaytime')[0]?.getAttribute('value') || 'Unknown',
        };
    } catch (error) {
        console.error(`Error fetching game details for ID ${gameId} from URL ${url}: ${error}`);
        return null;
    }
}

export async function loadGames() {
    try {
        const response = await axios.get(`https://api.geekdo.com/xmlapi2/collection?username=${import.meta.env.VITE_BGG_USERNAME}`);
        const xmlText = response.data;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        const items = xmlDoc.getElementsByTagName('item');
        const gameList = [];

        for (let item of items) {
            const status = item.getElementsByTagName('status')[0];
            if (status && status.getAttribute('own') === '1') {
                const gameId = item.getAttribute('objectid');
                const gameDetails = await fetchGameDetails(gameId);
                if (gameDetails) {
                    gameList.push(gameDetails);
                }
            }
        }

        games.set(gameList);
    } catch (error) {
        console.error(`Error loading games: ${error}`);
    }
}