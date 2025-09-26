#include <iostream>
#include "../include/backend.hpp"

int main() {

    Backend backend;

    backend.insereAdministrador("Aeronautics Barata", "WLEF7YTE", "2001-11-01", "AeronauticsBarata@tuta.io");
    backend.insereAdministrador("Otávio Bundasseca", "dafg87yfpq", "1978-07-13", "otaviozinho123o@yahoo.com.br");
    backend.insereAdministrador("Ilegível Inilegível", "XQEW3OI8UR45FH", "1964-03-31", "inelegivelInelegivel@tw1tt3r.com.us");

    backend.removeAdministrador("Aeronautics Barata");
    // a remoção de um administrador não apaga o registro;

    backend.insereFuncionario("Lança Perfume Rodometálico de Andrade", "defvcetrdf6584r", "2011-11-03", "lancadorzinho@outlook.com");
    backend.insereFuncionario("Maria Privada de Jesus", "987fv78d", "1999-04-19", "mariaprivada@gmail.com");
    backend.insereFuncionario("Bandeirante do Brasil Paulistano", "erfdókpfe894", "1950-07-26", "paulistanobrasil@yahoo.com");
    backend.insereFuncionario("Tobias do Gel Antisséptico", "tobiasclean", "1988-01-11", "tobiclean@globo.com");
    backend.insereFuncionario("Reginalda do Canto Agudo", "reghi99", "1976-03-08", "regicanto@hotmail.com");
    backend.insereFuncionario("Péricles Desgovernado", "pericleto23", "1985-06-22", "peridao@uol.com");
    backend.insereFuncionario("Gilda Guarda-Chuva Invertido", "gildachuva", "1990-10-30", "gildaaac@live.com");
    backend.insereFuncionario("Wesley Ciclone Quântico", "quantumwes", "1997-09-17", "wesloco@gmail.com");
    backend.insereFuncionario("Paulo Laranja Sincera", "paulinho78", "1992-02-28", "paulolaranjasincera@terra.com");
    backend.insereFuncionario("Maristela do Bicho Geográfico", "geoStella", "1981-12-05", "maristela.geo@globo.com");
    backend.insereFuncionario("Claudiomar Reticente", "claudioRet", "1970-04-14", "claureti@email.com");
    backend.insereFuncionario("Nair do Cacto Emotivo", "cactonair", "1965-08-08", "nairzinha@flora.net");
    backend.insereFuncionario("Rogério Aspirador de Pó", "rogeaspira", "1983-03-27", "rogerdusty@gmail.com");
    backend.insereFuncionario("Valdicleusa Travessa", "travaldi22", "1979-07-19", "valdiclue@gmail.com");
    backend.insereFuncionario("Eugênia do Céu Cinzento", "eucinzenta", "1995-11-01", "eucinza@outlook.com");
    backend.insereFuncionario("Hamilton da Cuia Sonora", "cuiahambro", "1984-01-01", "hamsonora@globo.com");
    backend.insereFuncionario("Josefina Brado Retumbante", "retumbajos", "1977-06-06", "josefinabrada@gmail.com");
    backend.insereFuncionario("Arlindo do Gás Desaparecido", "arlindogas", "1982-08-29", "arlindodesaparecido@oi.com.br");
    backend.insereFuncionario("Severino da Esfera Plana", "severoplanus", "1975-05-05", "severoesfera@bol.com.br");
    backend.insereFuncionario("Neuza da Fotocópia Espiritual", "neuzacopy22", "1986-09-14", "neuzaespiritual@xeroxsagrada.com");


    backend.removeFuncionario("Lança Perfume Rodometálico de Andrade");
    // a remoção de um funcionário não apaga o registro;


    backend.insereVeterinario("Antonio Manso Pacífico de Oliveira Sossegado", "fedrewd23", "1871-02-28", "antonio@yahoo.com");
    backend.insereVeterinario("Dolores Fuertes de Barriga", "juyu77urtfg", "1977-01-16", "dolores@yahoo.com");
    backend.insereVeterinario("Robson Terapêutico dos Bichos", "robvet123", "1982-02-02", "robsbiovet@globo.com");
    backend.insereVeterinario("Beatriz do Soro Encantado", "beatricxvet", "1990-10-20", "beavet@magianet.com");
    
    backend.removeVeterinario("Antonio Manso Pacífico de Oliveira Sossegado");
    //a remoção de um veterinário não apaga o registro;

    cout << backend.loginAdministrador("Aeronautics Barata", "WLEF7YTE") << endl; // falha por existir registro, mas ele estar como "inativo", administrador ja removido;
    cout << backend.loginFuncionario("Lança Perfume Rodometálico de Andrade", "ERRADAERRADAERRADA") << endl; // falha por estar com a senha incorreta;
    cout << backend.loginVeterinario("Dolores Fuertes de Barriga", "juyu77urtfg") << endl; // ocorre corretamente;

    return 0;

}
