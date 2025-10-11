"use client";

import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Card } from '@/components/ui/card';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

export default function ApiDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);

  const handleCopy = (text: string, type: 'endpoint' | 'example') => {
    navigator.clipboard.writeText(text);
    if (type === 'endpoint') {
      setCopiedEndpoint(true);
      setTimeout(() => setCopiedEndpoint(false), 2000);
    } else {
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    }
  };

  const apiEndpoint = "https://api.ewgf.gg/battles/{polarisId}";
  const exampleUrl = "https://api.ewgf.gg/battles/3YrtMtjNqqBn";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-gray-400">Access player battle history programmatically</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-2xl">
            <div className="p-6">
              {/* Endpoint */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Get Player Battles</h2>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded font-bold text-xs">
                    GET
                  </span>
                  <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded p-3 flex items-center justify-between">
                    <code className="text-blue-400 font-mono text-sm">
                      {apiEndpoint}
                    </code>
                    <button
                      onClick={() => handleCopy(apiEndpoint, 'endpoint')}
                      className="ml-2 text-gray-400 hover:text-white transition-colors"
                      aria-label="Copy endpoint"
                    >
                      {copiedEndpoint ? <FaCheck className="text-green-400" /> : <FaCopy />}
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Returns all battles for a player using their Polaris ID.
                </p>
              </div>

              {/* Authentication */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
                <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
                  <code className="text-blue-400 font-mono text-sm">
                    Authorization: Bearer YOUR_TOKEN_HERE
                  </code>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Contact us on <a href="https://discord.gg/EUEnH99har" className="text-blue-400 hover:underline">Discord</a> for API access.
                </p>
              </div>

              {/* Example */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Example Request</h3>
                <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
                  <div className="flex items-start justify-between mb-1">
                    <button
                      onClick={() => handleCopy(`curl -X GET "${exampleUrl}" -H "Authorization: Bearer YOUR_TOKEN"`, 'example')}
                      className="ml-auto text-gray-400 hover:text-white transition-colors text-xs"
                      aria-label="Copy example"
                    >
                      {copiedExample ? <FaCheck className="text-green-400" /> : <FaCopy />}
                    </button>
                  </div>
                  <pre className="text-blue-400 font-mono text-xs overflow-x-auto">
{`curl -X GET "${exampleUrl}" \\
  -H "Authorization: Bearer YOUR_TOKEN"`}
                  </pre>
                </div>
              </div>

              {/* Response */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Response (BattleDTO)</h3>
                <div className="bg-gray-900/50 border border-gray-700 rounded p-4 overflow-x-auto">
                  <pre className="text-gray-300 font-mono text-xs leading-relaxed">
{`[
  {
    "battleAt": "2025-10-09T22:06:17Z",
    "battleType": "RANKED_BATTLE",
    "gameVersion": 20500,
    "winner": 1,
    "stageId": 101,
    "p1Name": "GoodAzzTekkenFG",
    "p1PolarisId": "3FHnjYy75GyE",
    "p1Char": "Devil Jin",
    "p1RegionId": "Americas",
    "p1TekkenPower": 179142,
    "p1DanRank": "Battle Ruler",
    "p1RoundsWon": 3,
    "p2Name": "Beef Calculator",
    "p2PolarisId": "3YrtMtjNqqBn",
    "p2Char": "Lee",
    "p2RegionId": "Americas",
    "p2DanRank": "Flame Ruler",
    "p2TekkenPower": 147883,
    "p2RoundsWon": 0
  }
]`}
                  </pre>
                </div>
                <div className="mt-3 text-xs text-gray-400 space-y-1">
                  <p>• <span className="text-blue-400">battleAt</span>: UTC timestamp in ISO 8601 format</p>
                  <p>• <span className="text-blue-400">battleType</span>: RANKED_BATTLE, QUICK_BATTLE, PLAYER_BATTLE, or GROUP_BATTLE</p>
                  <p>• <span className="text-blue-400">winner</span>: 1 (player 1), 2 (player 2), or 3 (draw)</p>
                  <p>• <span className="text-blue-400">regionId</span>: Can be null</p>
                  <p>• All responses are JSON formatted and gzip compressed</p>
                </div>
              </div>

              {/* Error Codes */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Error Codes</h3>
                <div className="space-y-3">
                  {/* 400 Bad Request */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded font-bold text-xs">
                        400
                      </span>
                      <span className="text-white font-semibold text-sm">Bad Request</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      Returned when an invalid Polaris ID format is provided.
                    </p>
                    <div className="bg-gray-950/50 border border-gray-800 rounded p-2">
                      <code className="text-red-400 font-mono text-xs">
                        Invalid Polaris ID format
                      </code>
                    </div>
                  </div>

                  {/* 401 Unauthorized */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold text-xs">
                        401
                      </span>
                      <span className="text-white font-semibold text-sm">Unauthorized</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      Returned when the authorization token is missing, incorrect, or not valid.
                    </p>
                    <div className="bg-gray-950/50 border border-gray-800 rounded p-2">
                      <code className="text-red-400 font-mono text-xs">
                        Unauthorized access. Please provide a valid token.
                      </code>
                    </div>
                  </div>

                  {/* 404 Not Found */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded font-bold text-xs">
                        404
                      </span>
                      <span className="text-white font-semibold text-sm">Not Found</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      Returned when the specified Polaris ID does not exist in the database.
                    </p>
                    <div className="bg-gray-950/50 border border-gray-800 rounded p-2">
                      <code className="text-red-400 font-mono text-xs">
                        Player &#123;polarisId&#125; not found.
                      </code>
                    </div>
                  </div>

                  {/* 429 Rate Limit */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold text-xs">
                        429
                      </span>
                      <span className="text-white font-semibold text-sm">Rate Limit Exceeded</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      Returned when you exceed the API rate limit. The response includes information about how long to wait before retrying.
                    </p>
                    <div className="bg-gray-950/50 border border-gray-800 rounded p-2">
                      <code className="text-red-400 font-mono text-xs">
                        Rate limit exceeded. Please wait X seconds before retrying.
                      </code>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Check the <span className="text-blue-400">Retry-After</span> header for the exact wait time in seconds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
