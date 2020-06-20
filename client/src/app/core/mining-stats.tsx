import React, { useState, useEffect, FC } from 'react'
import socketIOClient from 'socket.io-client'

export const MiningStats: FC = () => {
  const [miningStats, setMiningStats] = useState<any>([])

  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080')
    socket.on('FromAPIMine', (data) => {
      setMiningStats((prevStats) => {
        const stats = prevStats.length > 5 ? prevStats.pop() : prevStats
        return [data].concat(stats)
      })
    })
    return () => socket.disconnect()
  }, [])

  return (
    <div>
      <h2>Mining stats:</h2>
      {miningStats.map(({ hash, hashBinary, difficulty, nonce, timestamp }) => (
        <div key={hash}>
          <div>Hash binary: {hashBinary}</div>
          <div>Hash hex: {hash}</div>
          <div>Difficulty: {difficulty}</div>
          <div>Nonce: {nonce}</div>
          <div>Time: {new Date(timestamp).toLocaleString()}</div>
          <hr />
        </div>
      ))}
      <h3>TODO:Time to mine block: 853ms. Difficulty: 20. Average time: 375.43ms</h3>
    </div>
  )
}
