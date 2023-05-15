import React, { useState } from 'react'

function RandomGif() {
   // const [gifNumber, setGifNumber] = useState(1)
   // const numGgifs = 3 // replace with the number of gifs available
   //  const gifUrl = `./mygifs/${gifNumber}.gif`
   // const [gifIndex, setGifIndex] = useState(0)

   const gifArray = []

   for (let i = 1; i <= 54; i++) {
      gifArray.push(
         <img src={`https://happygiraffe.co.uk/mygifs/${i}.gif`} alt={`gif ${i}`} />
      )
   }

   // const gifs = [
   //    '1.gif',
   //    '2.gif',
   //    '3.gif',
   //    // add more GIF file names here
   // ]

   // function handleClick() {
   //    const newGifNumber = Math.ceil(Math.random() * gifs)
   //    setGifNumber(newGifNumber)
   // }

   return <div>{gifArray}</div>
}

export default RandomGif
