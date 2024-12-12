import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const MainScreen = ({navigation}) => {
  const [sprites, setSprites] = useState([]);
  const [spriteStates, setSpriteStates] = useState({
    dog: {x: 0, y: 0, angle: 0},
    bone: {x: 0, y: 0, angle: 0},
  });
  const [actions, setActions] = useState({dog: [], bone: []});
  const [collisionOccurred, setCollisionOccurred] = useState(false);

  const addSprite = type => {
    if (sprites.length < 2 && !sprites.includes(type)) {
      setSprites([...sprites, type]);
    }
  };

  const checkCollision = () => {
    const dog = spriteStates.dog;
    const bone = spriteStates.bone;

    const collision =
      Math.abs(dog.x - bone.x) < 50 && Math.abs(dog.y - bone.y) < 50;

    if (collision && !collisionOccurred) {
      setCollisionOccurred(true);
      swapActions();
    } else if (!collision && collisionOccurred) {
      setCollisionOccurred(false);
    }
  };

  const swapActions = () => {
    setActions(prevActions => ({
      ...prevActions,
      dog: prevActions.bone,
      bone: prevActions.dog,
    }));
  };

  const playActionsForSprite = sprite => {
    let lastState = {...spriteStates[sprite]};
    let lastAction = null;
    const spriteActions = actions[sprite];

    spriteActions.forEach((action, index) => {
      setTimeout(() => {
        const updatedState = action.performAction(lastState, lastAction);
        lastState = {...lastState, ...updatedState};
        setSpriteStates(prev => ({
          ...prev,
          [sprite]: {...prev[sprite], ...updatedState},
        }));
        lastAction = action;
      }, index * 1000);
    });
  };

  useEffect(() => {
    checkCollision();
  }, [spriteStates.dog, spriteStates.bone]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sprite Animator</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.spriteRow}>
          <View style={styles.spriteControlContainer}>
            <Text style={styles.spriteHeaderText}>Dog</Text>
            <TouchableOpacity
              style={[
                styles.button,
                sprites.includes('dog') && styles.disabledButton,
              ]}
              onPress={() => addSprite('dog')}
              disabled={sprites.includes('dog')}>
              <Text style={styles.buttonText}>Add Dog</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => playActionsForSprite('dog')}>
              <Text style={styles.buttonText}>Play Dog</Text>
            </TouchableOpacity>
            <Text style={styles.coordinateText}>X: {spriteStates.dog.x}</Text>
            <Text style={styles.coordinateText}>Y: {spriteStates.dog.y}</Text>
          </View>
          <View style={styles.spriteControlContainer}>
            <Text style={styles.spriteHeaderText}>Bone</Text>
            <TouchableOpacity
              style={[
                styles.button,
                sprites.includes('bone') && styles.disabledButton,
              ]}
              onPress={() => addSprite('bone')}
              disabled={sprites.includes('bone')}>
              <Text style={styles.buttonText}>Add Bone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => playActionsForSprite('bone')}>
              <Text style={styles.buttonText}>Play Bone</Text>
            </TouchableOpacity>
            <Text style={styles.coordinateText}>X: {spriteStates.bone.x}</Text>
            <Text style={styles.coordinateText}>Y: {spriteStates.bone.y}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              playActionsForSprite('dog');
              playActionsForSprite('bone');
            }}>
            <Text style={styles.buttonText}>Play Both</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('ActionsPage', {
                actions,
                setActions,
                sprites,
              })
            }>
            <Text style={styles.buttonText}>Add Actions</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.spriteContainer}>
        {sprites.includes('dog') && (
          <Image
            source={require('../assets/images/dog.png')}
            style={[
              styles.sprite,
              {
                transform: [
                  {translateX: spriteStates.dog.x},
                  {translateY: spriteStates.dog.y},
                  {rotate: `${spriteStates.dog.angle}deg`},
                ],
              },
            ]}
          />
        )}
        {sprites.includes('bone') && (
          <Image
            source={require('../assets/images/bone.png')}
            style={[
              styles.sprite,
              {
                transform: [
                  {translateX: spriteStates.bone.x},
                  {translateY: spriteStates.bone.y},
                  {rotate: `${spriteStates.bone.angle}deg`},
                ],
              },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    // padding: 10,
  },
  headerContainer: {
    backgroundColor: '#6200ea',
    paddingVertical: 25,
    alignItems: 'center',
    // borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonContainer: {
    // marginVertical: 20,
    // paddingHorizontal: 20,
  },
  spriteRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  spriteControlContainer: {
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  spriteHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 18,
    margin: 8,
    borderRadius: 25,
    elevation: 3,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  actionButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 20,
    borderRadius: 25,
    elevation: 3,
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  coordinateText: {
    fontSize: 14,
    marginTop: 8,
    color: '#3e3e3e',
    backgroundColor: '#e9ecef',
    padding: 6,
    borderRadius: 8,
    width: 120,
    textAlign: 'center',
  },
  spriteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sprite: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
});

export default MainScreen;
