-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 28, 2020 at 07:11 PM
-- Server version: 5.7.30-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trap-mobile`
--

-- --------------------------------------------------------

--
-- Table structure for table `instalaciones`
--

CREATE TABLE `instalaciones` (
  `nombre` varchar(100) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `instalaciones`
--

INSERT INTO `instalaciones` (`nombre`, `id`) VALUES
('Ciencias y Tecnologías Aplicadas a la Producción, al Ambiente y al Urbanismo', 1),
('Ciencias Exactas, Físicas y Naturales', 2),
('Ciencias Sociales, Jurídicas y Económicas', 3),
('Ciencias Humanas y de la Educación', 4),
('Ciencias de la Salud', 5),
('Museo de Ciencias Antropologicas y Naturales', 6),
('Albergue Universitario', 7),
('Colegio Pre Universitario General San Martín', 8);

-- --------------------------------------------------------

--
-- Table structure for table `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `entrada` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `salida` timestamp NULL DEFAULT NULL,
  `dni_usuario` varchar(15) NOT NULL,
  `temperatura` decimal(3,1) NOT NULL,
  `supero_olfativo` tinyint(4) NOT NULL,
  `dni_guardia_ingreso` varchar(15) NOT NULL,
  `dni_guardia_egreso` varchar(15) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `movimientos_instalaciones`
--

CREATE TABLE `movimientos_instalaciones` (
  `id_movimiento` int(11) NOT NULL,
  `id_instalaciones` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `movimientos_respuestas`
--

CREATE TABLE `movimientos_respuestas` (
  `id_movimiento` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `superada` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `cuerpo` varchar(100) NOT NULL,
  `respuesta_esperada` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `preguntas`
--

INSERT INTO `preguntas` (`id`, `cuerpo`, `respuesta_esperada`) VALUES
(1, '¿Ha estado recientemente en contacto con algún caso covid-19 positivo?', 0),
(2, '¿Ha salido de la ciudad en los últimos 14 días?', 0),
(3, '¿Ha tenido fiebre esta semana?', 0);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `nombre` varchar(25) NOT NULL,
  `valor` varchar(25) NOT NULL,
  `tipo` varchar(15) NOT NULL,
  `tooltip` varchar(100) NOT NULL,
  `display` varchar(50) NOT NULL,
  `placeholder` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`nombre`, `valor`, `tipo`, `tooltip`, `display`, `placeholder`) VALUES
('starting_fever_point', '37.5', 'number', 'Temperatura mínima a partir de la cual se considera que una persona tiene fiebre.', 'Límite de temperatura', 'Ej. 37.5');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `dni` varchar(15) NOT NULL,
  `apellido` varchar(35) NOT NULL,
  `nombre` varchar(35) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios_admins`
--

CREATE TABLE `usuarios_admins` (
  `dni_usuario` varchar(15) NOT NULL,
  `habilitado` tinyint(4) NOT NULL DEFAULT '0',
  `password` varchar(15) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios_guardias`
--

CREATE TABLE `usuarios_guardias` (
  `dni_usuario` varchar(15) NOT NULL,
  `password` varchar(15) NOT NULL,
  `habilitado` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `instalaciones`
--
ALTER TABLE `instalaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movimientos_instalaciones`
--
ALTER TABLE `movimientos_instalaciones`
  ADD PRIMARY KEY (`id_movimiento`,`id_instalaciones`);

--
-- Indexes for table `movimientos_respuestas`
--
ALTER TABLE `movimientos_respuestas`
  ADD PRIMARY KEY (`id_movimiento`,`id_pregunta`);

--
-- Indexes for table `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`nombre`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`dni`);

--
-- Indexes for table `usuarios_admins`
--
ALTER TABLE `usuarios_admins`
  ADD PRIMARY KEY (`dni_usuario`);

--
-- Indexes for table `usuarios_guardias`
--
ALTER TABLE `usuarios_guardias`
  ADD PRIMARY KEY (`dni_usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `instalaciones`
--
ALTER TABLE `instalaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
