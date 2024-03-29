import React, { useState } from "react";
import { ScrollView, Image, Text, View, Linking, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import RoundIconBtn from "./RoundIconBtn";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNotes} from '../contexts/NoteProvider'
import NoteInputModal from "./NoteInputModal";
import colors from "../misc/colors";

const formatDate = (ms)=>{
    const date = new Date(ms)
    const day = date.getDate()
    const month = date.getMonth()+1
    const year = date.getFullYear()
    const hrs = date.getHours()
    const min = date.getMinutes()
    return `${month}/${day}/${year} - ${hrs}:${min}`
}



const NoteDetail = (props)=>{
    const [note,setNote] = useState(props.route.params.note)
    const headerHeight = useHeaderHeight()
    const {setNotes} = useNotes()
    const [showModal,setShowModal] = useState(false)
    const [isEdit,setIsEdit] = useState(false)
    const [isFocus, setisFocus] = useState(false);
    const deleteNote =async()=>{
        const result = await AsyncStorage.getItem('notes')
        let notes = []
        if(result!==null)notes = JSON.parse(result)
        const newNotes = notes.filter(n=> n.id !==note.id)
        setNotes(newNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
        props.navigation.goBack()
    }
    const displayDeleteAlert =()=>{
        Alert.alert('Bạn chắc chắn?', 'Hành động này sẽ xóa ghi chú vĩnh viễn!',[
            {
                text: 'Không',
                onPress: ()=> console.log('No, thanks')
            },
            {
                text: 'Xóa',
                onPress:()=>deleteNote()
            }
        ],{
            cancelable: true
        })
    }

    const handleUpdate = async (title, description, time, image) => {
        const result = await AsyncStorage.getItem('notes');
        let notes = [];
        if (result !== null) notes = JSON.parse(result);
      
        const newNotes = notes.map(n => {
          if (n.id === note.id) {
            n.title = title;
            n.description = description;
            n.isUpdated = true;
            n.time = time;
            n.image = image;
            return n;
          } else {
            return n;
          }
        });
      
        setNote({
          ...note,
          title,
          description,
          isUpdated: true,
          time,
          image,
        });
      
        setNotes(newNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      };
      
    const handleOnClose =()=>setShowModal(false)
    const openEditModal = ()=>{
        setIsEdit(true)
        setShowModal(true)
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;


    return(
        <>
            <ScrollView contentContainerStyle={[styles.container,{paddingTop : headerHeight}]}>
                <Text style={styles.time}> {note.isUpdated 
                                            ? `Updated at: ${formatDate(note.time)}`
                                            :`Created at: ${formatDate(note.time)}`}</Text>
                <TouchableOpacity onPress={()=>{
                    openEditModal(); 
                    setisFocus(true);
                }}>
                    <Text style={styles.title}>{note.title}</Text>
                    {note.image && <Image source={{uri: note.image}} style={{width: 200, height: 200, backgroundColor:colors.Primary}} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    openEditModal();
                    setisFocus(false);
                }}>

            <Text>
                {note.description.split(urlRegex).map((text, index) => (
                /\b((?:https?|ftp|file):\/\/[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#\/%=~_|])/gi.test(text) ?

                <Text style={{color:'blue',textDecorationLine: 'underline',}} key={index} onPress={() => Linking.openURL(text)} >
                    {text}
                </Text> : text
                ))}
            </Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.btnContainer}>
                    <RoundIconBtn
                        onPress={()=>displayDeleteAlert()} 
                        antIconName={'delete'} 
                        style={{backgroundColor:colors.Primary, marginBottom : 15}}/>
                    <RoundIconBtn
                        onPress={()=>openEditModal()} 
                        antIconName={'edit'} 
                        style={{backgroundColor:colors.Primary, marginBottom : 15}}/>
            </View>

            <NoteInputModal 
                isEdit={isEdit} note={note} 
                onClose={handleOnClose} 
                onSubmit={handleUpdate} 
                visible={showModal}
                isFocus={isFocus}/>

        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
        paddingHorizontal : 15,
    },
    title:{
        fontSize : 25,
        color: '#1e2870',
        fontWeight : 'bold'
    },
    description:{
        fontSize : 20,
        color: 'seagreen',
        opacity : 0.6
    },
    time:{
       textAlign:'right',
        fontSize : 12,
        opacity: 0.5,
    },
    btnContainer:{
        position : 'absolute',
        right: 15,
        bottom : 30
    }
})

export default NoteDetail