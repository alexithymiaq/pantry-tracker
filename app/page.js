'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button, Grid} from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState("")

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      } else{
        await setDoc(docRef, {quantity: 1})
      }
  
    await updateInventory()
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
  
    await updateInventory()
  }

  const filteredinventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase)
  )

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={'column'}>
    <Box width={"55vw"} maxWidth="1000px" display={"inline-block"} marginBottom={2}>
    <Grid container gap={3} justifyContent="flex-end">
      <Button onClick={handleOpen} variant='contained' color='success'>+ Add Item</Button>
        <Grid container gap={1} justifyContent="flex-end">
          <Box>
            <TextField
              id="standard-search"
              label="Search"
              variant="filled"
              inputProps={{ style: { textTransform: 'capitalize' } }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
        </Grid>
    </Grid>
    
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute" 
            top="50%" 
            left="50%"
            width={400}
            bgcolor="#FFFF"
            border="2px solid #0000"
            boxShadow={24}
            p={3}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
            }}
          >
        <Typography 
        variant="h5"
        display ="flex"
        alignItems="center" 
        justifyContent="center"
        >
          Enter Item Name
        </Typography>
        <Stack width="100%" direction="row" spacing={2}>
          <TextField 
          variant='filled'
          color = 'success'
          fullWidth
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value)
          }}
        />
        <Button
          variant = 'contained'
          color='success'
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
      <Box border='4px solid #333'>
        <Box 
          width = "814px" 
          height = "100px" 
          display ="flex"
          alignItems="center" 
          justifyContent="center"
        >
            <Box width="90vw" maxWidth="1000px" height="100px" textAlign={'center'} bgcolor={'#A1D39A'} padding={"30px"}>
            <Typography variant="h4" gutterBottom>
                Your Pantry
              </Typography>
            </Box>
      </Box>
      <Box 
        width="90vw" 
        maxWidth="50px" 
        minHeight={{ xs: "400px", sm: "1px" }} 
        maxHeight="20px" 
        sx={{ overflowY: 'auto' }} 
      ></Box>
      <Grid container spacing={2} sx={{ mb: 2 }} paddingTop={'18px'}>
          <Grid item xs={4} sm={4.5} textAlign="center">
            <Typography variant="h6">Item</Typography>
          </Grid>
          <Grid item xs={4} sm={2.2} textAlign="center">
            <Typography variant="h6">Quantity</Typography>
            </Grid>
        </Grid>
    <Stack width="800px" height="300px" spacing={2} overflow="auto">
      {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="50px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={5}
          >
            <Grid container spacing={4} sx={{ bgcolor: '#A1D39A', padding: '20px', '& > .MuiGrid-item': { padding: '0' } }} alignItems="center">
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
                <Typography>{quantity}</Typography>
            </Grid>
            <Stack direction="row" spacing={2}>
            <Button 
              variant='contained'
              color="success"
              onClick={() => {
                addItem(name)
              }}
            >
            + Add
            </Button>
            <Button 
              variant='contained'
              color="error"
              onClick={() => {
                removeItem(name)
              }}
            >
              - Remove
            </Button>
            </Stack>
            </Grid>
          </Box>
        ))}
    </Stack>
    </Box>
    </Box>
  </Box>
  </Box>
  )
}