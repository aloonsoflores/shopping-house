import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // fondo uniforme
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563EB', // azul principal
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111',
  },
  linkText: {
    color: '#2563EB',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Items de la lista
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 8,
  },

  // Estilo de item comprado
  listItemBought: {
    backgroundColor: '#e0e0e0',
  },

  // Texto principal del item
  listItemText: {
    fontSize: 16,
    color: '#333',
  },

  // Subtexto (por ejemplo, quién lo añadió)
  listItemSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
