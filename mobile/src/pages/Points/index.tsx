import React, { useEffect, useState } from 'react';
import { Feather as Icon} from '@expo/vector-icons'
import { View
        , StyleSheet
        , Text
        , TouchableOpacity
        , ScrollView
        , Image
        , SafeAreaView
        , Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item { 
    id: number,
    title: string,
    image_url: string,
}
interface Point {
    id: number,
    name: string,
    image: string,
    image_url: string,
    latitude: number,
    longitude: number,
}

interface Params{
    uf: string,
    city: string
}

const Points = () =>{

    const navigation = useNavigation();

    const route = useRoute();
    const routeParams = route.params as Params;
    
    // array que armazena os dados de retorno da API de itens
    const [items, setItems] = useState<Item[]>([]);

    // array para armazenar os itens selecionados na tela
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    // armazenar latitude e longitude atuais do usuário
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    // armazenar os pontos retornados pela API
    const [ points, setPoints] = useState<Point[]>([]);
    
    // Obter geolocalização
    useEffect(() => {
        async function loadPosition(){
            // verifica o estado da permissão
            const { status } = await Location.requestPermissionsAsync();
            // se não existir permissão, alerta
            if(status !== 'granted'){
                Alert.alert('Ooops...', 'Precisamos de sua permissão para obter a localização');
                return;
            }
            // obter a posição atual de forma assíncrona
            const location = await Location.getCurrentPositionAsync();
            // location.coordes contem as propriedades latitude e longitude
            const { latitude, longitude } = location.coords;
            // armazenar no estado
            setInitialPosition([
                    latitude, 
                    longitude
            ]);

        }
        loadPosition();
    }, []);

    // Obter os itens de coleta
    useEffect(()=>{
        const items = api.get('items').then(response =>{
            setItems(response.data)
        });
    },[]);

    // Obter os pontos cadastrados
    useEffect(()=>{
        api.get('points',{
            params:{ 
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data);
        })
    }, [selectedItems]);

    
    function handleNavigateBack(){    
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number){
        navigation.navigate('Detail', {point_id: id});
    }

    function handleSelectItem(id: number){        
        if(selectedItems.find(item => item === id)){
            const filteredItems = selectedItems.filter(item => item !== id); 
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    
    
    return (
        <SafeAreaView style={{ flex: 1}}>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79" />               
            </TouchableOpacity>

            <Text style={styles.title}>Bem vindo</Text>
            <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

            <View style={styles.mapContainer}>
                {initialPosition[0] !== 0 && (
                    <MapView 
                    style={styles.map}
                    initialRegion={{
                        latitude: initialPosition[0],
                        longitude: initialPosition[1],
                        latitudeDelta: 0.014,
                        longitudeDelta: 0.014
                    }}                                        
                >

                    { points.map(point => (
                        <Marker 
                            key={String(point.id)}
                            style={styles.mapMarker}
                            onPress={() => handleNavigateToDetail(point.id)}
                            coordinate={{
                                latitude: point.latitude,
                                longitude: point.longitude,
                            }}
                        >
                            <View
                                style={styles.mapMarkerContainer}
                            >
                                <Image style={styles.mapMarkerImage} source={ { uri: point.image_url}}  />
                                <Text style={styles.mapMarkerTitle}> {point.name} </Text>
                            </View>
                        </Marker>
                    ))}
                    
                 
                </MapView>
                )}
            </View>                        
        </View>
        <View style={styles.itemsContainer}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20}}
            >
            {items.map(item => (
                <TouchableOpacity 
                    activeOpacity={0.6}
                    key={String(item.id)} 
                    style={[
                            styles.item,
                            selectedItems.includes(item.id) ? styles.selectedItem : {}
                    ]} 
                    onPress={() => {handleSelectItem(item.id)}}
                >
                    <SvgUri width={42} height={42} uri={item.image_url} ></SvgUri>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
            ))}                        
            </ScrollView>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 30,
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

