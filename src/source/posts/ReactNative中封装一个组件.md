---
title: ReactNative中封装一个组件
date: 2021/6/21
tags: ReactNative
categories: Web前端
introduction: 之前用react-native写了一个安卓app，现在写一些react-native中如何合理组件化的功能
---

# 在ReactNative封装一个组件

## 定义组件的Props

```typescript
type ModalProps = Partial<React.ComponentProps<typeof Modal>>

type dataItem = {
  icon: string,
  title: string,
  color: string,
  handle?: (params: any) => void
}

interface ModalComponentProps extends Omit<ModalProps, 'list' | 'ref' | 'title'> {
  title: string;
  list?: dataItem[]; // 传过来的数据
  toggleModal?: () => void; // 改变是否可见的函数
  ModalStyle?: StyleProp<ViewStyle>, // modal的样式
  ModalContentStyle?: StyleProp<ViewStyle>, // modal中内容的样式
  leftTopChildren?: React.ReactNode, // 左上角子组件
  rightTopChildren?: React.ReactNode, // 右上角子组件
  contentChildren?: React.ReactNode // 内容组件
}

```



## 写组件中应用

```react
// 将自己定义的属性和组件自身的属性解构
const { list, toggleModal, title, ModalStyle, ModalContentStyle, rightTopChildren, leftTopChildren, contentChildren, ...rest } = props


  return (
      // 组件自身的属性直接传给组件
    <Modal onBackdropPress={toggleModal} {...rest}>
          // 自己定义的属性可以加一层判断
      <View style={ModalStyle ? ModalStyle : styles.modal}>
        <View style={styles.leftCom}>
          {
            leftTopChildren
          }
        </View>
        <View style={styles.rightCom}>
          {
            rightTopChildren ? rightTopChildren : <Icon name='closecircle' color="#dcdcdc" size={16} onPress={toggleModal}></Icon>
          }
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={ModalContentStyle ? ModalContentStyle : styles.modalContent}>
          {
            contentChildren ? contentChildren :
              list?.map((item, index) => {
                return (
                  <View style={styles.modalItem} key={index}>
                    <Icon name={item.icon} size={40} color={item.color} onPress={item.handle}></Icon>
                    <Text style={styles.modalItemTitle}>{item.title}</Text>
                  </View>
                )
              })
          }
        </View>
      </View>
    </Modal>
  )
```



## 调用组件

```react
   <ModalComponent
        title={'新建文件夹'}
        isVisible={isFolderVisible}
        toggleModal={toggleFolder}
        ModalStyle={styles.folderModal}
        rightTopChildren={<TouchableNativeFeedback onPress={toggleFolder}><Text style={{ color: '#6a5acd', fontWeight: 'bold' }}>完成</Text></TouchableNativeFeedback>}
        leftTopChildren={<TouchableNativeFeedback onPress={toggleFolder}><Text style={{ color: '#000000' }}>取消</Text></TouchableNativeFeedback>}
        contentChildren={
          <View style={styles.folderModalContent}>
            <EntypoIcon name='folder' size={150} color={'#6495ed'}></EntypoIcon>
            <TextInput style={styles.folderName} placeholder={'新建文件夹'} focusable={true}></TextInput>
          </View>
        }
      >
      </ModalComponent>
```

