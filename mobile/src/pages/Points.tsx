import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Feather as FeatherIcon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../services/api';

export interface Point {
    id: number;
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
    latitude: number;
    longitude: number;
    items: Array<{ title: string }>;
}

export interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Params {
    uf: string;
    city: string;
}

const Points: React.FC = () => {

    const [getPoints, setPoints] = useState<Point[]>([]);
    const [getItems, setItems] = useState<Item[]>([]);

    const [getSelectedItems, setSelectedItems] = useState<number[]>([]);

    const [getLocation, setLocation] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as Params;

    useEffect( () => {

        //fetchLocation();
        fetchItems();

    }, []);

    useEffect( () => {

        fetchPoints();

    }, [getSelectedItems]);

    async function fetchLocation(){

        try {

            const permission = await Location.requestPermissionsAsync();
            
            if(permission.granted){

                const location = await Location.getCurrentPositionAsync();
                
                setLocation([location.coords.latitude, location.coords.longitude]);

            } else {

                Alert.alert('Ops', 'Precisamos da sua permissão para obter a localização');

                navigation.navigate('Home');
            }
            
        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Erro ao buscar localização');
        }
    }

    async function fetchPoints(){

        try {
            
            const response = await api.get(`/points?city=${params.city}&uf=${params.uf}&items=${String(getSelectedItems).replace(/\[\]\s/g,'').replace(/\s/g,'')}`);

            setPoints(response.data);
            
        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Erro ao buscar pontos');
        }
    }

    async function fetchItems(){

        try {

            const response = await api.get(`/items`);

            setItems(response.data);
            
        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Erro ao buscar ítens');
        }
    }

    function handleSelectedItem(id: number){

        if(getSelectedItems.includes(id)){

            const items = getSelectedItems.filter( (item) => item !== id);

            setSelectedItems(items);

        } else {

            setSelectedItems([ ...getSelectedItems, id ]);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <FeatherIcon 
                        name='arrow-left' 
                        color='#34cb79'
                        size={20}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Bem Vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {/*(getLocation[0] !== 0) && */(
                        <MapView 
                            style={styles.map}
                            initialRegion={{ 
                                latitude: /*getLocation[0],*/ -22.4746482, 
                                longitude: /*getLocation[1],*/-47.458847,
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}
                        >
                            {getPoints.map( (point) => (
                                <Marker
                                    key={point.id}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: point.latitude, 
                                        longitude: point.longitude,
                                    }}
                                    onPress={() => navigation.navigate('Details', { ...point })}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image 
                                            style={styles.mapMarkerImage}
                                            source={{ uri: point.image }} 
                                        />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}
                >
                    {getItems.map( (item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.item , (getSelectedItems.includes(item.id) ? styles.selectedItem : {} )]}
                            activeOpacity={0.7}
                            onPress={() => handleSelectedItem(item.id)}
                        >
                            <SvgUri 
                                width={42} 
                                height={42} 
                                uri={item.image_url}
                            />
                            <Text style={styles.itemTitle}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;
