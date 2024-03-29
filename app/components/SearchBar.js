import React from "react";
import { View, StyleSheet, TextInput } from 'react-native'
import colors from "../misc/colors";
import { AntDesign } from '@expo/vector-icons'
const SearchBar =({containerStyle,value,onClear,onChangeText})=>{
    return (
        <View style={[styles.container,{...containerStyle}]}>
            <AntDesign 
                name="search1"
                size={20}
                color={colors.Primary} 
                style={{position :"absolute", left: 10}} />
            <TextInput  value={value} 
                        onChangeText={onChangeText} 
                        style={styles.searchBar} 
                        placeholder='Tìm kiếm'/>
            {value?<AntDesign 
                        name="close" 
                        size={20} 
                        color={colors.Primary} 
                        onPress={onClear}
                        style ={styles.clearIcon}/>:null}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center'
    },
    searchBar:{
        borderWidth : 3,
        borderColor : colors.Primary,
        height: 40,
        borderRadius : 20,
        paddingLeft : 30,
        fontSize: 16,
        paddingRight:30,
    },
    clearIcon:{
        position :"absolute",
        right : 10,
    }
    
})

export default SearchBar;