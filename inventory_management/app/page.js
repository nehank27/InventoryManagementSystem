'use client'
import Image from "next/image";
import "./globals.css";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { query, collection, doc, getDoc, deleteDoc, setDoc, getDocs } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const item = { name: doc.id, ...doc.data() };
      if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        inventoryList.push(item);
      }
    });
    setInventory(inventoryList);
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory(searchTerm)
  }, [searchTerm])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  if (isLandingPage) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        className="fade-in"
      >
        <Typography variant="h1" className="landing-title">StockMate</Typography>
        <Button className="button" variant="contained" onClick={() => setIsLandingPage(false)}>Begin</Button>
      </Box>
    )
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          className="modal-box"
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant='contained'
              className="button"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      {/* Search Bar */}
    <TextField
      variant='outlined'
      placeholder='Search Stock...'
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="button"
      sx={{ width: '400px', mb: 2 }} // Adjust width and margin as needed
    />


      <Button
        className="button"
        variant="contained"
        onClick={() => handleOpen()}
      >
        Add New Item
      </Button>
      <Box className="inventory-box">
        <Box
          width="600px"
          height="100px"
          bgcolor="#007BFF" /* Bright blue */
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h3" color="#ffffff">
            Inventory Items
          </Typography>
        </Box>

        <Stack width="600px" height="500px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box key={name} className="item-box" width="93%" display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h3" color="#333" textAlign="center" fontSize="30px">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center" fontSize="30px">
                {quantity}
              </Typography>
              <Button className="button" variant="contained" onClick={() => addItem(name)}>
                Add
              </Button>
              <Button className="button2" variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
