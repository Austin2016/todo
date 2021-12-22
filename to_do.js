//const prompt = require('prompt-sync')(); Not sure if this is needed since I'm using browser not node... 

//-----begin


//class 1 
const to_do_factory = {         //protoype object which is a set of methods...
                               // its like the 'methods' in a class with no initialize
  mark_as_done () {
    this.state = 0;  
  }


};
const to_do_constructor = (title,desc,date,state="1") => Object.assign(Object.create(to_do_factory),{title: title, desc: desc,date: date, state: state});





//class 2 
const list_factory = {         
                                //add item to list, delete item, move item
          
  add_to_do (item) { 
    this.list.push(item); 
  }, 
  
  move_to_do (item_index,destination_index) {
    deleted_item = this.delete_to_do (item_index);
    rest_of_array = this.list.splice(destination_index);   
    this.list.push(deleted_item);
    this.list = this.list.concat(rest_of_array);    
  },
  
  delete_to_do (index) {
    temp_array = this.list.splice(index + 1); 
    deleted_item = this.list.pop();
    this.list = this.list.concat(temp_array); 
    return deleted_item;
  },
  

  return_to_do_index_based_on_title(title) {
    for (let i = 0; i< this.list.length;i++) {
      if (this.list[i].title==title) {
        return i;             
      };
    };
  },

  return_to_do_based_on_title(title) {
    for (let i = 0; i< this.list.length;i++) {
      if (this.list[i].title==title) {
        return this.list[i];              
      };
    };
  }

};
const list_constructor = (list=[]) => Object.assign(Object.create(list_factory),{list:list});





//class 3 
const proj_factory =  {         
  add_proj (name) { 
    this.proj_dict[name] = list_constructor();

  },

  delete_proj(name) {
    delete this.proj_dict.name;

  },

  select_proj(name) {
    this.selected_proj = name; 

  },

  add_to_do_to_selected_project(to_do) {
    this.proj_dict[this.selected_proj].add_to_do(to_do);

  },

  remove_to_do_from_selected_project(index) {
    this.proj_dict[this.selected_proj].delete_to_do(index);

  },

  re_prioritize_to_do_in_selected_project(starting_index,destination_index) {
    this.proj_dict[this.selected_proj].move_to_do(starting_index,destination_index);
  },
   
  return_selected_proj_to_dos() {
    return this.proj_dict[this.selected_proj]

  },

  create_new_to_do_list(name) {
    this.proj_dict[name] = list_constructor();
  },

  call_project_methods_based_on_inputs (User_Action=null) {

      //ui.display_to_dos(my_proj);
      //User_Action = dialogue.get_action()
      switch (User_Action) {
        
        case "1":
            title = dialogue.get_title(this);
            desc =  dialogue.get_description();
            date = dialogue.get_due_date();
            my_to_do = to_do_constructor(title,desc,date);
            this.add_to_do_to_selected_project(my_to_do);
            return title;  
          break;

        case "2":
            to_do_title_to_delete = dialogue.get_existing_title(this);
            list_object = my_proj.proj_dict[my_proj.selected_proj];
            index = (list_object.return_to_do_index_based_on_title(to_do_title_to_delete));
            this.remove_to_do_from_selected_project(index);
            
          break;

        case "3":
            to_do_to_move = dialogue.get_existing_title(this);
            user_entered_priority = dialogue.get_priority();
            index_of_to_do_to_move = this.proj_dict[this.selected_proj].return_to_do_index_based_on_title(to_do_to_move);
            index_associated_with_user_entered_priority = dialogue.translate_priority(user_entered_priority,this.proj_dict[this.selected_proj]);
            this.re_prioritize_to_do_in_selected_project(index_of_to_do_to_move,index_associated_with_user_entered_priority);
          break;

        case "4":
            title_of_to_do_to_mark_done = dialogue.get_existing_title(this);
            to_do = this.proj_dict[this.selected_proj].return_to_do_based_on_title(title_of_to_do_to_mark_done);
            to_do.mark_as_done(); 
          
          break;

        case "5":
            name_of_new_list =  dialogue.get_name_of_new_list();
            this.create_new_to_do_list(name_of_new_list);
            
          break;

        case "6":
            user_selected_list = dialogue.ask_which_project_user_wants_to_see(this);
            this.select_proj(user_selected_list);

          break;
        case "7":
            //ui.display_all_lists();  
          break;   

        
      }
      
    
  }   


};
const proj_constructor = (selected_proj="default",proj_dict={"default":list_constructor()}) => Object.assign(Object.create(proj_factory),{selected_proj:selected_proj, proj_dict:proj_dict});


//class 4 , class methods only 
const dialogue = {   
  get_action() { 
    const action = prompt("what would you like to do?");
    return action;
  },

  welcome()  {
    console.log("\n--------\n\nWelcome to Next Best Action! \nYou are in your default list. \nHere is your Action Legend:\n");
  },

  get_existing_title(proj) {
    input = prompt("please enter a title:");
    selected_list_object = proj.proj_dict[proj.selected_proj];
    while ( selected_list_object.list.includes( selected_list_object.return_to_do_based_on_title(input) ) == false ) {
      input = prompt("that is not a valid title, please enter another title.");
    }
    return input;
  },

  get_title() {
    return prompt("Add a new title");
  },

  get_description() {
    return prompt("Add a description:");
  },

  get_due_date() {
    return prompt("when is it due?");
  },

  get_priority() {
    input = prompt("what priority do you want to give this to_do?");
    while ( Math.sign(input) != 1 ) { 
      input = prompt("please enter a positive number");
      }
    return input; 
  },

  translate_priority(user_entered_priority,list_object) { 
    return list_object.list.length - user_entered_priority 
  },

  get_name_of_new_list() {
    return prompt("what do you want your new list of todos to be called?")  
  },

  ask_which_project_user_wants_to_see(proj) {
    input = prompt("what is the title of the project you want to work with?"); // this needs validation
    array = Object.keys(proj.proj_dict);
    while ( array.includes( input ) == false ) {
      input = prompt("that is not a valid title, please enter another title.");
    }
    return input;
  }
};
 

//class 5, class methods only   
const to_do_array_of_strings = {

  return_to_do_array(project) {
    array = []
    list = project.proj_dict[project.selected_proj].list
    for (let i = list.length - 1; i > -1; i--) {
      if (list[i].state == 1) {
        array.push(list[i].title + " " + list[i].date);
      }
      else { 
        array.push(list[i].title + " " + list[i].date + " [done]" );
      }
    }
  return array; 
  },

  return_all_details(project) {
    array = this.return_to_do_array(project);
    array_with_desc = [];
    list = project.proj_dict[project.selected_proj].list;
    list_reverse = [];
    list.forEach( e=>list_reverse.push(e) );
    list_reverse.reverse();
    for (let i = 0;i < array.length; i++) {
      array_with_desc[i] = array[i] + " " + list_reverse[i].desc;
    }
    return array_with_desc;   
  }  


}; 

  
//my_proj = proj_constructor();


/* initial todos loaded for testing 
const my_to_do_1 = to_do_constructor('make bed','dont forget to wash pillow case',"2021-05-22",1);
const my_to_do_2 = to_do_constructor('make dinner','dont burn food',"2021-05-22",1);
const my_to_do_3 = to_do_constructor('make desert','ice cream sunday',"2021-05-22",1);
const my_to_do_4 = to_do_constructor('run','run on sunday',"2021-05-22",1);

my_proj.add_to_do_to_selected_project(my_to_do_3);
my_proj.add_to_do_to_selected_project(my_to_do_2);
my_proj.add_to_do_to_selected_project(my_to_do_1);
*/


//UI module 


window.onload = function() {
  

  var x = 0   //global var storing state, affects if todo 'description' should be displayed
  //console.log(localStorage.getItem("test"));
  

  function remove_details_button() {
    button = document.getElementById("clickMe9");
    if (document.getElementById("div").childElementCount == 1) {
      button.remove();
    }

  };

  function add_details_button() {
    if (document.getElementById("div").childElementCount == 0) {
      div = document.getElementById("div")
      elem =document.createElement("button")
      elem.classList = "s";
      elem.id = "clickMe9";
      elem.innerText = "details";
      div.appendChild(elem);
      document.getElementById("clickMe9").onclick = function() {
      if (x == 1) {
        x = 0;     
      }
      else {
        x = 1;
      }
      display_list(x);
      set_text_for_heading_to_to_dos();
      }
    }

  };


  function set_text_for_heading_to_lists() {
    heading = document.getElementById("var");
    heading.innerText = "here are my lists/projects!!"

  };

  function set_text_for_heading_to_to_dos() {
    heading = document.getElementById("var");
    heading.innerText = "here are my to_dos for my current list/project!"

  };

  function display_all_lists() {
    array = Object.keys(my_proj.proj_dict);
    lists = document.getElementById("lists");
    lists.innerHTML = "";
    list.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
      a_list_element = document.createElement("li")
      a_list_element.innerText = array[i];
      lists.appendChild(a_list_element);  
    }

  }; 
  
  function display_list(include_description = 0) {

    if (include_description == 0) {
      array = to_do_array_of_strings.return_to_do_array(my_proj);
    }
    else {
      array = to_do_array_of_strings.return_all_details(my_proj);
    }
    list = document.getElementById("todos");
    lists.innerHTML = "";
    list.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
      to_do = document.createElement("li");
      to_do.innerText = array[i];
      list.appendChild(to_do);
      //localStorage.setItem("test","hello_world");


    };
  };

  function save(my_proj) {
    localStorage.setItem( "my_proj",JSON.stringify(my_proj) );  
  };

  function load() {
    return JSON.parse( localStorage.getItem("my_proj") );
  };
  
  //localStorage.removeItem("my_proj");   //clears out storage, triggers new proj built
  
  if( !localStorage.getItem("my_proj") ) {    //testing if storage is populated for that key ;
    my_proj = proj_constructor();
    save(my_proj);
    console.log("new project built")
  }
  else {
    proto_proj = proj_constructor();
    proto_list = list_constructor();
    proto_do = to_do_constructor();
    my_proj = load("my_proj");
    list_object = my_proj.proj_dict[my_proj.selected_proj];
    Object.setPrototypeOf(my_proj, proto_proj);  
    Object.setPrototypeOf(list_object,proto_list);
    list_object.list.forEach( e=> Object.setPrototypeOf(e,proto_do) );
  }
  
  //localStorage.removeItem("my_proj");

  add_details_button();
  display_list();


  document.getElementById("clickMe1").onclick = function() {
      input = "1";
      //my_object.x = item ;
      //my_object.increment();
      //console.log(my_object.x);
      my_proj.call_project_methods_based_on_inputs(input);
      //list = document.getElementById("todos")
      //to_do = document.createElement("li")
      //to_do.innerText = new_to_do
      //list.appendChild(to_do);
      display_list(x);
      add_details_button();
      set_text_for_heading_to_to_dos();
      save(my_proj);
      //console.log( my_proj.return_selected_proj_to_dos() );
     // document.createElement("li");
      //console.log(my_proj.proj_dict[my_proj.selected_proj].list[0].title)
  };

  document.getElementById("clickMe2").onclick = function() {
      input = "2";
      my_proj.call_project_methods_based_on_inputs(input);
      display_list(x);
      add_details_button();
      set_text_for_heading_to_to_dos();
      save(my_proj);
  };

  document.getElementById("clickMe3").onclick = function() {
      input = "3";
      my_proj.call_project_methods_based_on_inputs(input);
      display_list(x);
      add_details_button();
      set_text_for_heading_to_to_dos();
      save(my_proj);
  };

  document.getElementById("clickMe4").onclick = function() {
      input = "4";
      my_proj.call_project_methods_based_on_inputs(input);
      display_list(x);
      add_details_button();
      set_text_for_heading_to_to_dos();
      save(my_proj);

  };

  document.getElementById("clickMe5").onclick = function() {
      input = "5";
      my_proj.call_project_methods_based_on_inputs(input);
      display_list(x);
      add_details_button();
      set_text_for_heading_to_to_dos();
      save(my_proj);

  };

  document.getElementById("clickMe6").onclick = function() {
      input = "6";
      my_proj.call_project_methods_based_on_inputs(input);
      display_list(x);
      add_details_button();
      set_text_for_heading_to_to_dos();
      save(my_proj);

  };

  document.getElementById("clickMe7").onclick = function() { // changes dom a lot
      //input = "7";
      //my_proj.call_project_methods_based_on_inputs(input);
      display_all_lists();
      set_text_for_heading_to_lists();
      remove_details_button();
  };
  
  document.getElementById("clickMe8").onclick = function() {
      display_list(x);
      set_text_for_heading_to_to_dos();
      add_details_button();
  };

  
  

 



 
  

};



























