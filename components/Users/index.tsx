// UserScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UseUsersData } from '@/api/user';
import Icon from 'react-native-vector-icons/FontAwesome';
import { User} from '@/Interfaces/UserInterface';



const UserScreen = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = UseUsersData();
  const dataAPI = data?.pages?.flatMap(page => page.results) ;
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [dataList, setDataList] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState('all');
  const [orderList, SetOrderList] = useState(false);
  const [selectUser,SetSelectUser] = useState<User[]>()
  const [detailModalVisible,SetDetailModalVisible] = useState(true)


 // 
  useEffect(() => {
    if (dataAPI) {
      handleChange(searchQuery);
    }
  }, [selectedGender,searchQuery]);


  
 // 
 useEffect(() => {
  if (dataAPI) {
    let filteredData = dataAPI;

    if (selectedGender !== 'all') {
      filteredData = dataAPI.filter((user: User) => user.gender.toLowerCase() === selectedGender.toLowerCase());
    }
    if (searchQuery.length > 0) {
      filteredData = filteredData.filter((user: User) =>
        user.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.last.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if(orderList){
      filteredData.sort((a:User,b:User)=> a.name.first.localeCompare(b.name.first))
    }

    setDataList(filteredData);
  }
}, [selectedGender, searchQuery,data,orderList]);



if (isLoading) {
  return (
    <View style={styles.LoadingBox}>
      <Image source={require('@/assets/images/logo.jpeg')} style={styles.Logo} />
    </View>
  );
}

if (error) {
  return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>Não foi possível carregar a página :(</Text>
    </View>
  );
}



  function handleChange(query: string) {
    setSearchQuery(query);

    if (dataAPI) {
      let filteredData = dataAPI.filter(user =>
        (user.name.first.toLowerCase().includes(query.toLowerCase()) ||
          user.name.last.toLowerCase().includes(query.toLowerCase())) &&
        (selectedGender === 'all' || user.gender.toLowerCase() === selectedGender.toLowerCase())
      );
      setFilteredUsers(filteredData);
    }
  }

 
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }




  const renderUserItem = ({ item }: { item: User }) => (

      <TouchableOpacity
      
       onPress={() => { SetSelectUser(item); SetDetailModalVisible(true); }}
       style={styles.userContainerBox}>
          
         <View style={{left:1,height:80,justifyContent:'center',marginRight: 16,marginLeft:30}}>
            <Image source={{ uri: item.picture.large }} style={styles.image} />
          </View> 
          <View style={styles.userContainer}>
                <Text style={styles.name}>{`${item.name.first} ${item.name.last}`}</Text>
                <View style={{justifyContent:'space-between',width:"100%",}}>
                    <Text style={styles.email}>{item.gender}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.email}>{formatDate(String(item.dob.date))}</Text>
                </View>                
           </View>
      </TouchableOpacity>
  );

  
  

  return (
    <View style={styles.container}>
      <View style={styles.Headercontainer}>
        <View>
          <Text style={styles.Text}>InnovaTech</Text>
        </View>
        <View style={styles.SearchBarBox}>
          <View style={styles.SearchBarcontainer}>
            <Icon name="search" size={18} color="#818181" />
            <TextInput
              style={styles.input}
              placeholder="Pesquise ..."
              placeholderTextColor={"#fff"}
              onChangeText={handleChange}
              value={searchQuery}
            />
            <Text style={styles.TextInput}>
              Total: {dataList.length}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name="filter" size={30} color="#818181" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={styles.userBox}
        data={dataList}
        renderItem={renderUserItem}
        keyExtractor={(item, index) => `${item.email}-${index}`}
        ListFooterComponent={
          hasNextPage ? (
            <Button
              onPress={() => fetchNextPage()}
              title={isFetchingNextPage ? "Carregando..." : "Carregar mais"}
            />
          ) : (
            <Text style={styles.noMoreText}>No more users to load</Text>
          )
        }
      />

      <Modal
        animationType='fade'
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => SetOrderList(!orderList)}

            >
              <Text style={{color:"#fff",width:"100%",justifyContent:"center"}}>Ordenar por nome</Text>
            </TouchableOpacity>
            <Picker
              selectedValue={selectedGender}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedGender(itemValue)}
              
            >
              <Picker.Item label="Todos" value="all"/>
              <Picker.Item label="Homem" value="male" />
              <Picker.Item label="Mulher" value="female" />
            </Picker>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setVisible(false)}
            >
              <Text style={{color:"#fff",width:"100%",justifyContent:"center"}}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {
        selectUser && (
          <Modal
            animationType='fade'
            transparent={true}
            visible={detailModalVisible}
            onRequestClose={() => {
            SetDetailModalVisible(!detailModalVisible);}}
          >
            <View style={styles.modalBackground}>
               <View style={styles.modalContainer}>
                <Image source={{uri:selectUser.picture.large}} style={styles.detailImage}/>
                <View style={styles.modalContainerText}>
                    <Text style={styles.detailName}>{`${selectUser.name.first} ${selectUser.name.last}`}</Text>
                    <Text style={styles.detailText}><Text style={{fontSize: 16,color:"#fff",fontWeight: 'bold',}}>Email:</Text> {selectUser.email}</Text>
                    <Text style={styles.detailText}><Text style={{fontSize: 16,color:"#fff",fontWeight: 'bold',}}>Gênero:</Text>  {selectUser.gender}</Text>
                    <Text style={styles.detailText}><Text style={{fontSize: 16,color:"#fff",fontWeight: 'bold',}}>Data de nascimento:</Text>  {formatDate(String(selectUser.dob.date))}</Text>
                    <Text style={styles.detailText}><Text style={{fontSize: 16,color:"#fff",fontWeight: 'bold',}}>Telefone:</Text>  {selectUser.phone}</Text>
                    <Text style={styles.detailText}><Text style={{fontSize: 16,color:"#fff",fontWeight: 'bold',}}>Nacionalidade:</Text>  {selectUser.nat}</Text>
                    <Text style={styles.detailText}><Text style={{fontSize: 16,color:"#fff",fontWeight: 'bold',}}>Endereço:</Text>  {`${selectUser.location.street.name}, ${selectUser.location.street.number}, ${selectUser.location.city}, ${selectUser.location.state}, ${selectUser.location.country}`}</Text>
                    <Text style={styles.detailText}><Text style={{fontSize: 16,color:"#fff",fontWeight: 'bold',}}>ID:</Text>  {selectUser.id.value}</Text>
                    <TouchableOpacity
                        style={styles.modalOption}
                        onPress={() => SetDetailModalVisible(false)}
                     >
                        <Text style={{color:"#fff",width:"100%",justifyContent:"center",alignContent:"center"}}>Fechar</Text>
                     </TouchableOpacity>
                </View>
               </View>
            </View>
          </Modal>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    //marginTop: '10%',
    width: '100%',
    backgroundColor:"#242425"
  },
  Headercontainer: {
    width: '100%',
    backgroundColor: '#242425',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  Text: {
    color: '#fff',
    fontSize: 38,
  },
  SearchBarBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom:10
  },
  SearchBarcontainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '92%',
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 11,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
  TextInput: {
    width: '40%',
    alignItems: 'center',
    color:"#fff"
  },
  input: {
    width: '80%',
    paddingHorizontal: 8,
    color: "#fff",
  },
  userContainerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    height:80,
    width:'100%',
    marginBottom: 10,
    borderBottomColor: 'gray',
    borderBottomWidth:1
   
    //backgroundColor:"#5647"
  },
  userContainer:{
    width:300,
    height:80,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flexDirection: 'column',
    //backgroundColor:"#1313",


  },
  userContainerText:{ 
    
   backgroundColor:"#111",
   width:370,
  
  },
  image: {
    width: 68,
    height: 70,
    borderRadius: 25,
  
  },
  name: {
    fontSize: 18,
    color:"#fff",
    fontWeight: 'bold',
    justifyContent:'flex-start'
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
  LoadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Logo: {
    height: 380,
    width: 290,
  },
  noMoreText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#242425',
    borderRadius: 10,
    alignItems: 'center',
    color:"#fff"
  },
  modalOption: {
    padding: 10,
    justifyContent:'center',
    width:"100%",
    color:"#fff"
  },
  picker: {
    width: '100%',
    color:"#fff",
   
  },
  
  modalDetails:{

  },
  detailImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#fff"
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color:"gray"
  },

});

export default UserScreen;
