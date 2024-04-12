'use client'
import {ZodError, z} from 'zod';
import { fromZodError } from 'zod-validation-error';
// const UserSchema = z.object({
//   id:z.string(),
//   name:z.string().min(3,'minimum name characters is 3')
// }).partial()
enum Hobbies {
  Programming = 'programming',
  Cooking = 'cooking',
  Gardening = 'gardening'
}
const emailSchema = z.string().refine((val)=> val.endsWith('@gmail.com'),{
  message:'It must be a gmail'
})
// Javascript Map
// const UserMap = z.map(z.string(), z.object({ name: z.string() }))
// const map = new Map([
//   ['123e33',{name:'Shahab'}],
//   ['123e34',{name:'Adnan'}]
// ])
// Javascript Set
// const UserSet = z.set(z.number());
// const set = new Set([
//   1,2,3,4
// ])
// console.log('UserSet:',UserSet.parse(set))
const statusSchema = z.discriminatedUnion('status',[z.object({
  status:z.literal('success'),data:z.string()
}),
z.object({
  status:z.literal('error'),error:z.instanceof(Error)
})

])
const coords = z.tuple([z.number(),z.number()]).rest(z.string())
const dateSchema = z.union([z.string(),z.number(),z.date()]);
const ClassSchema = z.object({
  className:z.string(),
  section:z.string().optional()
})
const recordSchema = z.record(z.string())
const UserSchema = z.object({
  id:z.string().or(z.number()),
  name:z.string().min(3,'minimum name characters is 3'),
  email:emailSchema,
  image:z.string().nullable().default(null), //pass null
  // image:z.string().optional() // the value will become optional
  // image:z.string().nullish()  //pass null or undefined
  age:z.number().lte(100,'Age must be less then 100').gte(18,'Age must be greater then 18').int(),
  hobbies: z.nativeEnum(Hobbies).optional(),
  personalInformation:z.object({
    cnic:z.number()
  }).optional(),
  location:coords,
  joinDate: dateSchema,
  response:statusSchema,
  records:recordSchema
}).merge(ClassSchema).passthrough().omit({id:true})
const UserDataArray = z.array(UserSchema);

// .partial() //optional all values
// .pick({id:true,name:true}) // Pick values that must not be optional
// deepPartial() is used to optional the nested object
// .strict() is used to must add value
//extends // to add additional value 
//passThrough() add any keys
// type User = z.infer<typeof UserSchema>;
// omit // option the value
const user = [{
  id:1,
  name:'ali afzal',
  email:'aliafzal@gmail.com',
  age:18,
  hobbies:'cooking',
  className:'10th',
  location:[72.13,33.09,'Rahimyar khan'],
  joinDate:'2024-04-13',
  response:{status:'success',data:'Hello world'},
  records:{_id:'12e44',subject:'English'}
  // fatherName:'gulam rasool',
  
},
{
  id:'2',
  name:'ahmad',
  email:'ahmad@gmail.com',
  age:20,
  hobbies:'programming',
  className:'10th',
  location:[71.65,31.06],
  joinDate:'2023-02-10',
  response:{status:'success',data: 'Hello world'},
  records:{_id:'12e44',subject:'English'}
}
]
// console.log(UserSchema.parse(user)) // will give a error
// console.log(UserSchema.safeParse(user)) // will show the status in true or false
// const userValidation = UserSchema.safeParse(user)
const userValidation = UserDataArray.safeParse(user)
// working with zod-validation-error
if(userValidation?.success)
{
  console.log(userValidation?.data);
}else{
  console.log(fromZodError(userValidation?.error))
}
export default function Home() {

  
}
