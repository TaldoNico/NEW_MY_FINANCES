import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// O ícone 'chevron-back' (seta) é importado daqui:
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importa useRouter para navegação

// Captura a largura total da tela para responsividade
const { width } = Dimensions.get('window');

// --- Componente de Botão Customizado ---
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

// --- Componente Principal da Tela (profile.tsx) ---
const ProfileScreen: React.FC = () => {
  const router = useRouter(); // Inicializa o router
  
  // Estado do email (agora editável)
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // Estados para controlar a visibilidade das senhas
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // --- Funções de Ação ---
  const handleResetPassword = () => {
    if (newPassword === '' || confirmNewPassword === '') {
      Alert.alert('Erro', 'Preencha todos os campos de senha.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erro', 'As novas senhas não coincidem.');
      return;
    }
    
    // LÓGICA DE API PARA REDEFINIR A SENHA AQUI
    // NOTA: No React Native, use um modal personalizado em vez de Alert.alert() para produção.
    Alert.alert('Sucesso', 'Senha redefinida com sucesso para o email: ' + email);
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleLogout = () => {
    // LÓGICA PARA ENCERRAR A SESSÃO
    Alert.alert('Sessão Encerrada', 'Você saiu da sua conta.');
    
    // Redireciona o usuário para a rota de índice (Geralmente Login/Home principal)
    router.replace('/' as any);
  };
  
  return (
    <View style={styles.container}> 

        {/* ScrollView agora ocupa toda a tela para permitir centralização e rolagem em caso de teclado */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.card}>
            
            {/* --- TÍTULO AGORA DENTRO DO CARD --- */}
            <Text style={styles.cardTitle}>Meu Perfil</Text>

            {/* --- Avatar e Nome do Usuário --- */}
            <View style={styles.profileInfo}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
                style={styles.avatar}
              />
             
            </View>

            {/* --- Formulário --- */}
            <View style={styles.form}>
              
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email (para confirmação)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email do usuário"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable={true} // Editável
                />
              </View>
              
              {/* Nova Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova Senha</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, { flex: 1 }]}
                    placeholder="Digite a nova senha"
                    placeholderTextColor="#aaa"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                    <Feather name={showNewPassword ? 'eye-off' : 'eye'} size={22} color="#000000ff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar Nova Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, { flex: 1 }]}
                    placeholder="Confirme a nova senha"
                    placeholderTextColor="#aaa"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry={!showConfirmNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)} style={styles.eyeIcon}>
                    <Feather name={showConfirmNewPassword ? 'eye-off' : 'eye'} size={22} color="#000000ff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botão Redefinir Senha */}
              <CustomButton
                title="Redefinir Senha"
                onPress={handleResetPassword}
                // Ajuste de margem inferior para afastar do botão de logout
                style={[styles.resetButton, { marginBottom: 30 }]}
              />

              {/* Botão Encerrar Sessão */}
              <CustomButton
                title="ENCERRAR SESSÃO"
                onPress={handleLogout}
                // Ajuste de margem superior para afastar do botão de redefinir senha
                style={[styles.logoutButton, { marginTop: 30 }]}
              />
            </View>
          </View>
        </ScrollView>
        
        {/* --- Cabeçalho Superior (Apenas Botão Voltar) --- */}
        {/* Usamos position: 'absolute' para que ele fique sempre no topo sobrepondo o ScrollView */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.replace('/settings' as any)} 
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  // Container principal da aplicação
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // Fundo principal escuro
    // REMOVIDO paddingTop: 40 para que o ScrollView ocupe toda a tela
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 20, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinha o botão de volta à esquerda
    backgroundColor: 'transparent', // Fundo transparente
    minHeight: 60, 
    // AJUSTE CRÍTICO: Fica por cima do ScrollView
    position: 'absolute',
    top: 0,
    zIndex: 10,
    // Adicionado padding para respeitar a barra de status (notch)
    paddingTop: 40,
  },
  backButton: {
    padding: 8, // Padding pequeno para aumentar a área de clique, mas manter a posição no canto
    backgroundColor: 'rgba(30, 30, 30, 0.5)', // Fundo semi-transparente para facilitar a leitura
    borderRadius: 50,
  },
  
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center', // Mantém centralização horizontal
    // Reintroduzido para centralizar o card em telas maiores
    justifyContent: 'center', 
    // Espaço para o header fixo flutuante + um respiro visual extra
    paddingTop: 100, 
    paddingBottom: 40, // Espaçamento inferior
    paddingHorizontal: width * 0.05, // Espaçamento lateral responsivo
  },
  card: {
    backgroundColor: '#333030', // Alterado para o design do card mais escuro
    borderRadius: 20,
    padding: width * 0.06, // Padding responsivo
    width: '100%',
    maxWidth: 450, // Limite máximo para telas grandes
    alignItems: 'center',
    elevation: 10,
  },
  // --- Novo Estilo para o Título dentro do Card ---
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25, // Espaço entre o título e a foto
    marginTop: 5,
    textAlign: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 40, // Espaço maior entre o nome e o primeiro campo
  },
  avatar: {
    // ALTERADO: Tamanho da imagem para 200x200
    width: 200,
    height: 200,
    // Garantindo que o borderRadius seja metade do tamanho para ser um círculo perfeito
    borderRadius: 115.5, 
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#444', 
  },
  username: {
    color: '#fff',
    fontSize: 24, // Fonte um pouco maior
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20, // Espaçamento entre os grupos de input
  },
  label: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 5, // Espaço entre Label e Input
  },
  input: {
    backgroundColor: '#d9d9d9', 
    borderRadius: 10,
    padding: 10,
    width: '100%',
    color: '#000',
    height: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 40, // Espaço para o ícone do olho
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 8,
  },
  button: {
    width: '100%',
    borderRadius: 10, // Menos arredondado para um visual mais clean
    paddingVertical: 15,
    marginTop: 15,
    elevation: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#238423', // Verde
    marginTop: 30, // Espaço maior entre o último input e o botão
  },
  logoutButton: {
    backgroundColor: '#842323', // Vermelho
    marginTop: 30, // Ajustado para garantir o espaçamento
    marginBottom: 10,
  },
});

export default ProfileScreen;