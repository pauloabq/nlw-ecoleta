import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View
        , ImageBackground
        , Text
        , Image
        , StyleSheet
        , TextInput
        , KeyboardAvoidingView
        , Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';


interface IBGEUfResponse {
    sigla: string,
}
interface IBGECityResponse {
    nome: string,
}


const Home = () => {
    
    const [ufs, setUfs] = useState<string[]>([]);
    const [uf, setUfSelected] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [city, setCitySelected] = useState('');

    const navigation = useNavigation();

    // obter os estados
    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then( response => {
            // percorrer o json de retorno, e armazenar no array ufInitials
            const ufInitials = response.data.map( uf => uf.sigla )
            setUfs(ufInitials);
        })
    }, [])
    
    useEffect(() => {
        if(uf === ""){
            return;
        }
        setCities([])
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
             .then( response => {
                // percorrer o json de retorno, e armazenar no array ufInitials
                const cityNames = response.data.map( city => city.nome )
                setCities(cityNames);
             })
    }, [uf])

    // função para o evento e clique no botão - navegar para /Points
    function handleNavigationToPoints(){
        navigation.navigate('Points',{
            uf,
            city
        });
    }

    return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
        <ImageBackground 
            style={styles.container}
            source={require('../../assets/home-background.png')}
            imageStyle={{width:274, height:368}}
        >

            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <View>
                    <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                    <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                </View>
            </View>

            

            <View style={styles.footer}>
                <RNPickerSelect
                    placeholder={
                        {label: 'Selecione o Estado',
                         value: null,
                        }
                    }
                    onValueChange={value => setUfSelected(value)}
                    value={uf}
                    items={ufs.map( uf => (
                        { label: uf, value: uf }
                    ))}
                    useNativeAndroidPickerStyle={false}
                    style={styles}
                />
                <RNPickerSelect
                    placeholder={
                        {label: 'Selecione a Cidade',
                         value: null,
                        }
                    }
                    onValueChange={value => setCitySelected(value)}
                    value={city}
                    items={cities.map( city => (
                        { label: city, value: city }
                    ))}
                    useNativeAndroidPickerStyle={false}
                    style={styles}
                />
                
                <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>                        
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>    
        </ImageBackground>
    </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingVertical: 8,
    borderWidth: 0.5,    
    paddingRight: 30, // to ensure the text is never behind the icon
  },    
  container: {
    flex: 1,
    padding: 32,
    //backgroundColor: '#f0f0f5'
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