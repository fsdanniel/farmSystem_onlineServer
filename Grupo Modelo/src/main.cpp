#include <iostream>
#include "../include/backend.hpp"

int main() {
    Backend backend;

    backend.insereAdministrador("Aeronautics Barata", "WLEF7YTE", "2001-11-01", "AeronauticsBarata@tuta.io");
    backend.insereAdministrador("Otávio Bundasseca", "dafg87yfpq", "1978-07-13", "otaviozinho123o@yahoo.com.br");
    backend.insereAdministrador("Ilegível Inilegível", "XQEW3OI8UR45FH", "1964-03-31", "inelegivelInelegivel@tw1tt3r.com.us");
    backend.removeAdministrador("Aeronautics Barata");
    //a remoção de um administrador não apaga o registro;

    backend.insereFuncionario("Lança Perfume Rodometálico de Andrade", "defvcetrdf6584r", "2011-11-03", "lancadorzinho@outlook.com");
    backend.insereFuncionario("Maria Privada de Jesus", "987fv78d", "1999-04-19", "mariaprivada@gmail.com");
    backend.insereFuncionario("Bandeirante do Brasil Paulistano", "erfdókpfe894", "1950-07-26", "paulistanobrasil@yahoo.com");
    backend.removeFuncionario("Lança Perfume Rodometálico de Andrade");
    //a remoção de um funcionário não apaga o registro;

    backend.insereVeterinario("Antonio Manso Pacífico de Oliveira Sossegado", "fedrewd23", "1871-02-28", "antonio@yahoo.com");
    backend.insereVeterinario("Dolores Fuertes de Barriga", "juyu77urtfg", "1977-01-16", "dolores@yahoo.com");
    backend.insereVeterinario("Baleira Dorra", "gtrf434r5ujyh", "1958-11-05", "baleira@yahoo.com");
    backend.removeVeterinario("Antonio Manso Pacífico de Oliveira Sossegado");
    //a remoção de um veterinário não apaga o registro;

    cout << endl;

    cout << backend.loginAdministrador("Aeronautics Barata", "WLEF7YTE") << endl;
    cout << backend.loginFuncionario("Maria Privada de Jesus", "987fv78d") << endl;
    cout << backend.loginVeterinario("Baleira Dorra", "gtrf434r5ujyh") << endl;

    return 0;

}
