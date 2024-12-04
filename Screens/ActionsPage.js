import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';

const ActionsPage = ({route, navigation}) => {
  const {actions, setActions, sprites} = route.params;
  const [selectedSprite, setSelectedSprite] = useState(sprites[0] || '');
  const [selectedActions, setSelectedActions] = useState([]);

  const allActions = [
    {
      name: 'Move 10 steps',
      performAction: prevState => ({
        x: prevState.x + 10,
      }),
    },
    {
      name: 'Move -10 steps',
      performAction: prevState => ({
        x: prevState.x - 10,
      }),
    },
    {
      name: 'Turn 90 degrees',
      performAction: prevState => ({
        angle: prevState.angle + 90,
      }),
    },
    {
      name: 'Turn -90 degrees',
      performAction: prevState => ({
        angle: prevState.angle - 90,
      }),
    },
    {
      name: 'Go to x: 50, y: 50',
      performAction: () => ({
        x: 50,
        y: 50,
      }),
    },
    {
      name: 'Repeat last action',
      performAction: (prevState, lastAction) => {
        if (lastAction) {
          return lastAction.performAction(prevState);
        }
        return prevState;
      },
    },
  ];

  const toggleAction = action => {
    setSelectedActions(prevSelected => {
      const isSelected = prevSelected.some(
        selected => selected.name === action.name,
      );
      let updatedSelectedActions;

      if (isSelected) {
        updatedSelectedActions = prevSelected.filter(
          selected => selected.name !== action.name,
        );
      } else {
        updatedSelectedActions = [...prevSelected, action];
      }

      updatedSelectedActions = updatedSelectedActions.map((action, index) => ({
        ...action,
        order: index + 1,
      }));

      return updatedSelectedActions;
    });

    setActions(prevActions => ({
      ...prevActions,
      [selectedSprite]: selectedActions,
    }));
  };

  const renderAction = ({item}) => {
    const isSelected = selectedActions.some(
      selected => selected.name === item.name,
    );
    return (
      <TouchableOpacity
        style={[styles.actionButton, isSelected && styles.selectedActionButton]}
        onPress={() => toggleAction(item)}>
        <Text
          style={[styles.actionText, isSelected && styles.selectedActionText]}>
          {item.name}{' '}
          {isSelected &&
            `(${
              selectedActions.find(action => action.name === item.name)?.order
            })`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Sprite</Text>
      <View style={styles.spriteSelector}>
        {sprites.map(sprite => (
          <TouchableOpacity
            key={sprite}
            style={[
              styles.spriteButton,
              selectedSprite === sprite && styles.selectedSprite,
            ]}
            onPress={() => setSelectedSprite(sprite)}>
            <Text
              style={[
                styles.spriteText,
                selectedSprite === sprite && styles.selectedSpriteText,
              ]}>
              {sprite}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.heading}>Actions</Text>
      <FlatList
        data={allActions}
        keyExtractor={item => item.name}
        renderItem={renderAction}
        contentContainerStyle={styles.actionsList}
      />
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // Lighter background for better contrast
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333', // Darker text for better readability
  },
  spriteSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  spriteButton: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 8,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6200ea',
    shadowColor: '#000', // Added shadow for a lifted effect
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Android shadow
  },
  selectedSprite: {
    backgroundColor: '#6200ea',
    borderColor: '#6200ea',
  },
  spriteText: {
    color: '#6200ea',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedSpriteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionsList: {
    paddingBottom: 20,
  },
  actionButton: {
    paddingVertical: 18,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6200ea',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedActionButton: {
    backgroundColor: '#6200ea',
    borderColor: '#6200ea',
  },
  actionText: {
    fontSize: 16,
    color: '#6200ea',
    fontWeight: '500',
  },
  selectedActionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  doneButton: {
    paddingVertical: 15,
    backgroundColor: '#6200ea',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  doneText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActionsPage;
