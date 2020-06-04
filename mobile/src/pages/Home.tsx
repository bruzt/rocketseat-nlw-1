import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Image, Text, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as FeatherIcon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

//import logo from '../../assets/logo.png';

interface IBGEUF {
    nome: string;
    sigla: string;
}

interface IBGECity {
    nome: string;
}

interface Item {
    label: string;
    value: string;
}

const Home: React.FC = () => {

    const [getUfs, setUfs] = useState<Array<Item>>([]);
    const [getCities, setCities] = useState<Array<Item>>([]);

    const [getUf, setUf] = useState('');
    const [getCity, setCity] = useState('');

    const navigation = useNavigation();

    useEffect(() => {

        fetchUfs();

    }, []);

    useEffect(() => {

        fetchCities();

    }, [getUf]);

    async function fetchUfs() {

        try {

            const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');

            const ufs = response.data.map((uf: IBGEUF) => ({
                label: uf.nome,
                value: uf.sigla
            }));

            setUfs(ufs);

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Erro ao buscar estados');
        }
    }

    async function fetchCities() {

        try {

            const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${getUf}/municipios`);

            const cities = response.data.map((uf: IBGECity) => ({
                label: uf.nome,
                value: uf.nome
            }));

            setCities(cities);

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Erro ao buscar estados');
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ImageBackground
                style={styles.container}
                source={require('../assets/home-background.png')}
                imageStyle={{
                    width: 274,
                    height: 368
                }}
            >
                <View style={styles.main}>
                    <Image source={require('../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de reíduos.</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>

                    <RNPickerSelect
                        placeholder={{ label: 'Selecione a UF', value: null }}
                        items={getUfs}
                        onValueChange={(value) => setUf(value)}
                    />

                    <RNPickerSelect
                        placeholder={{ label: 'Selecione a Cidade', value: null }}
                        items={getCities}
                        onValueChange={(value) => setCity(value)}
                    />

                    {/*     
                    <TextInput 
                        style={styles.input}
                        placeholder='Digite a UF'
                        autoCorrect={false}
                        value={getUf}
                        autoCapitalize='characters'
                        maxLength={2}
                        onChangeText={(value) => setUf(value)}
                    />

                    <TextInput 
                        style={styles.input}
                        placeholder='Digite a cidade'
                        autoCorrect={false}
                        value={getCity}
                        onChangeText={(value) => setCity(value)}
                    />
                    */}

                    <RectButton
                        style={styles.button}
                        onPress={() => navigation.navigate('Points', { uf: getUf, city: getCity })}
                    >
                        <View style={styles.buttonIcon}>
                            <Text>
                                <FeatherIcon
                                    name='arrow-right'
                                    color='#FFF'
                                    size={24}
                                />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;