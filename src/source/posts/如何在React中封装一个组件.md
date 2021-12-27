---
title: 如何在React中封装一个组件
date: 2021/5/15
tags: React
introduction: 最近在学习React，看了许多教学视频，今天学到了一个封装组件较完善的方法，特此记录下来
---

# 在React中封装一个组件

## 背景



我们知道<code>select</code>标签经常有显示的问题，例如<code>id</code>和<code>name</code>对应不上，原因在于<code>value</code>属性的值：

```react
<Select
          value={param.personId}
          onChange={(value) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        >
          <Select.Option value={""}>负责人</Select.Option>
          {users.map((user) => (
            <Select.Option key={user.id} value={String(user.id)}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
```

<code>Option</code>中的value值在传给<code>onChange</code>回调函数中时，如果是<code>number</code>类型，但<code>personId</code>定义的又是<code>string</code>类型的话，就不会按预期显示，而是直接用传入的值。

于是现在封装一个组件<code>id-select</code>，解决上述问题。

## 封装组件

在<code>components</code>文件夹下新建一个id-select.tsx文件，首先写好组件基本内容。

```react
import { Select } from "antd";
import React from "react";



export const IdSelect = () => {
    return (
        <Select value={} onChange={}>
            <Select.Option value={}>{}</Select.Option>
        </Select>
    )
}
```

我们要封装一个<code>Select</code>组件，使得其

+ value可以传入多种类型的值
+ onChange只会回调number | undefined类型
+ 当 isNaN(Number(value))为true 代表选择默认类型
+ 当选择默认类型，onChange回调undefined

定义下组件所需的<code>props</code>类型:

```react
interface IdSelectProps {
  value: string | number | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
```

定义一个辅助函数:

```react
const toNumber = (value: unknown) => {
  return isNaN(Number(value)) ? 0 : Number(value);
};
```

完善组件:

```react
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options } = props;
  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option value={option.id} key={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};
```

还有一个问题，如果我们需要用到<code>Select</code>本身的<code>props</code>呢，或者说我想改变<code>Select</code>本身的样式呢？

这就是一个<code>props</code>透传问题

<code>React</code>中有专门的处理方法，将接口改为如下:

```react
// 继承Select组件本身的props
type SelectProps = React.ComponentProps<typeof Select>;

// 去掉我们接口中定义的，防止重名
interface IdSelectProps
  extends Omit<
    SelectProps,
    "value" | "onChange" | "defaultOptionName" | "options"
  > {
  value: string | number | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

```

然后传给里面的<code>Select</code>组件：

```react
export const IdSelect = (props: IdSelectProps) => {
    // 用扩展操作符 ...rest取得props中剩余的属性
  const { value, onChange, defaultOptionName, options, ...rest } = props;
  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
        // 传给Select
      {...rest}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option value={option.id} key={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};
```

完整代码:

```react
import { Select } from "antd";
import React from "react";

type SelectProps = React.ComponentProps<typeof Select>;

interface IdSelectProps
  extends Omit<
    SelectProps,
    "value" | "onChange" | "defaultOptionName" | "options"
  > {
  value: string | number | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 *
 * value 可以传入都多种类型的值
 * onChange只会回调 number | undefined 类型
 * 当 isNaN(Number(value))为true 代表选择默认类型
 * 当选择默认类型，onChange回调undefined
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...rest } = props;
  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
      {...rest}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option value={option.id} key={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const toNumber = (value: unknown) => {
  return isNaN(Number(value)) ? 0 : Number(value);
};

```

一个简单的组件就封装好了

## example

```react
import React from "react";
import { useUser } from "screens/project-list/user";
import { IdSelect } from "./id-select";

export const UserSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { users } = useUser();
  return <IdSelect options={users || []} {...props}></IdSelect>;
};

```

