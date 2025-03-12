import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import {Icon, Avatar, Button} from "@rneui/base"

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AvatarComponent({userName, description}) {
    



    const [user, setUser] = useState();
  return (
    <View style={{flexDirection:'row', marginLeft: 16, marginBottom: 16}}>
            <Avatar
                rounded
                size="large"
                source={{uri: "https://lh3.googleusercontent.com/a-/ALV-UjX_alxdPhe8_QLTOla5aTw3ioGDa8EpQXLGGVHekQXzvhWcKQ8=s75-c"}
                }
                style={styles.avatar}
                

            />
            <View style={{marginLeft:8, justifyContent:'center', alignItems:'flex-start'}}>
                <Text style={{fontWeight:'bold'}}>{userName} </Text>
                <Text>{description ? description : "No hay descripción"}</Text>
            </View>

    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        marginTop: 64
    },
    avatar:{
        width: 100,
        height: 100,
    }
})